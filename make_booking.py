from distutils.log import error
import email
from flask import Flask, request, jsonify
from flask_cors import CORS
import os, sys
import requests
from invokes import invoke_http
import json
from os import environ
import amqp_setup
import pika
import re


app = Flask(__name__)
CORS(app, allow_headers=['Content-Type', 'Access-Control-Allow-Origin',
                         'Access-Control-Allow-Headers', 'Access-Control-Allow-Methods'])
booking_URL = environ.get('booking_URL') or "http://localhost:5001/booking"
passenger_URL = environ.get('passenger_URL') or "http://localhost:5000/passenger"
# activity_log_URL = environ.get('activity_log_URL') or "http://localhost:5003/activity_log"
# error_URL = environ.get('error_URL') or "http://localhost:5004/error"
validation_URL = environ.get('validation_URL') or "http://localhost:5002/validation"
payment_URL = "http://localhost:5005"

@app.route("/make_booking", methods=['POST'])
def make_booking():
    if request.is_json:
        try:
            # booking is a list of flight info + passenger info
            booking = request.get_json(force=True)
            print("\nReceived a booking in JSON:", booking)

            # for validating payment info
            if "payment_id" in booking:
                result = processPayment(booking)
                print('\n------------------------')
                print('\nresult: ', result)
                return jsonify(result), result["code"]
            # for processing booking info
            else:
                # Get booking info {booking ID}
                result = processMemberBooking(booking)
                print('\n------------------------')
                print('\nresult: ', result)
                return jsonify(result), result["code"]

        except Exception as e:
            # Unexpected error
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            ex_str = str(e) + " at " + str(exc_type) + ": " + fname + ": line " + str(exc_tb.tb_lineno)
            print(ex_str)

            return jsonify({
                "code": 600,
                "message": "make_booking.py internal error: " + ex_str
            }), 600
    # if not a JSON request
    return jsonify({
        "code": 100,
        "message": "Invalid JSON input: " + str(request.get_data())
    }), 100


def processMemberBooking(booking):
    # Invoke the booking microservice
    print('\n-----Invoking booking microservice-----')

    # add passenger + flight info into booking db (hardcode for now)
    print('Booking summary:', booking)
    passport = booking["passport"]
    flightNumber = booking["flightNumber"]
    departureDate = booking["departureDate"]
    bookingId = flightNumber+passport+departureDate
    bookingId = re.sub(r"[^a-zA-Z0-9]","",bookingId)
    booking["bookingStatus"] = "Pending"
    create_booking = invoke_http(booking_URL + "/" + bookingId, method='POST', json=booking)

    # Check the booking result; if a failure, send it to the error microservice.
    code = create_booking["code"]
    message = json.dumps(create_booking)

    amqp_setup.check_setup()

    if code not in range(200, 300):
        # Inform the error microservice
        print('\n\n-----Publishing the (booking error) message with routing_key=booking.error-----')
        amqp_setup.channel.basic_publish(exchange=amqp_setup.exchangename, routing_key="booking.error", 
            body=message, properties=pika.BasicProperties(delivery_mode = 2))

        print("\nBooking status ({:d}) published to the RabbitMQ Exchange:".format(code), create_booking)

        # Return error
        return {
            "code": code,
            "data": {
                "create_booking": create_booking
            },
            "message": message
        }
    else:
        # 4. Record new booking
        # record the activity log anyway
        print('\n\n-----Publishing the (booking info) message with routing_key=booking.info-----')        

        # invoke_http(activity_log_URL, method="POST", json=order_result)            
        amqp_setup.channel.basic_publish(exchange=amqp_setup.exchangename, routing_key="booking.info", 
            body=message)

        countDown = {}
        countDown.update({"bookingId": bookingId, "countDown": "Countdown", "bookingStatus": "Cancelled"})
        invoke_http(validation_URL, method='POST', json=countDown)
        # add passenger info into passenger db if not exist 
        update_passenger = addPassengerInfo(booking)
        message_update = json.dumps(update_passenger)

    # Return created booking record
    return {
        "code": code,
        "data": {
            "create_booking": create_booking,
            "update_passenger": update_passenger,
        },
        "message": {
            "create_booking":"Booking record has been created.",
            "update_passenger": message_update
        }
    }


def addPassengerInfo(booking):
    # check if the passenger info exists in the passenger db
    email = booking["email"]
    passenger_info = {}
    passenger_info.update({ "passport": booking["passport"], "lastname": booking["lastname"], "firstname": booking["firstname"], 
    "dob": booking["dob"], "gender": booking["gender"], "nationality": booking["nationality"], "phone":booking["phone"]})
    
        # if no data found in the passenger db, save the new passenger data into db
    add_passenger = invoke_http(passenger_URL + "/" + email, method='POST', json=passenger_info)
    code = add_passenger['code']
            
    # if error
    if code not in range(200, 300):
        # Inform the error microservice
        print('\n\n-----Publishing the (add passenger error) message with routing_key=addPassenger.error-----')
        message = json.dumps(add_passenger)
        amqp_setup.channel.basic_publish(exchange=amqp_setup.exchangename, routing_key="addPassenger.error", 
            body=message, properties=pika.BasicProperties(delivery_mode = 2))
        print("\nadd_passenger status ({:d}) published to the RabbitMQ Exchange:".format(code), add_passenger)
        # Return error
        return {
            "code": add_passenger["code"],
            "data": {
                "add_passenger": add_passenger
            },
            "message": message
            }
    # Return created passenger record
    return {
        "code": add_passenger["code"],
        "data": {
            "add_passenger": add_passenger
        },
        "message": "New passenger record has been created."
            }


def processPayment(booking):
    print('\n-----Invoking Validation microservice-----')

    # add passenger + flight info into booking db (hardcode for now)
    print('Payment info:', booking)
    update_booking = invoke_http(validation_URL, method='POST', json=booking)

    # Check the booking result; if a failure, send it to the error microservice.
    code = update_booking["code"]

    if code not in range(200, 300):
        # Inform the error microservice
        print('\n\n-----Publishing the (booking update error) message with routing_key=bookingUpdate.error-----')
        message = json.dumps(update_booking)
        amqp_setup.channel.basic_publish(exchange=amqp_setup.exchangename, routing_key="bookingUpdate.error", 
            body=message, properties=pika.BasicProperties(delivery_mode = 2))

        print("\nBooking update status ({:d}) published to the RabbitMQ Exchange:".format(code), update_booking)

        # Return error
        return {
            "code": code,
            "data": {
                "update_booking": update_booking
            },
            "message": "Booking update record error sent for error handling."
        }

    # Return validation result
    return {
        "code": code,
        "data": {
            "update_booking": update_booking
        },
        "message": message
    }   



if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) + " for makeing a booking...")
    app.run(host="0.0.0.0", port=5100, debug=True)