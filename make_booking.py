from flask import Flask, request, jsonify
from flask_cors import CORS
import os, sys
import requests
from invokes import invoke_http
import json
from os import environ
import amqp_setup_email
import pika
import json


app = Flask(__name__)
CORS(app)

booking_URL = environ.get('booking_URL') or "http://localhost:5001/booking"
passenger_URL = environ.get('passenger_URL') or "http://localhost:5000/passenger"
activity_log_URL = environ.get('activity_log_URL') or "http://localhost:5003/activity_log"
error_URL = environ.get('error_URL') or "http://localhost:5004/error"
# passenger_URL = environ.get('passenger_URL') or "http://localhost:5000/passenger"



# email_URL = 
#validation_URL = 
#...

@app.route("/make_booking", methods=['POST'])
def make_booking():
    if request.is_json:
        try:
            # booking is a list of flight info + passenger info
            booking = request.get_json(force=True)
            print("\nReceived a booking in JSON:", booking)

            # check login status
            login_status = True

            # if logged in
            if login_status:
                # Get booking info {booking ID}
                result = processMemberBooking(booking)
                print('\n------------------------')
                print('\nresult: ', result)
                return jsonify(result), result["code"]
            else:
                result = processGuestBooking()
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
                "code": 500,
                "message": "make_booking.py internal error: " + ex_str
            }), 500
    # if not a JSON request
    return jsonify({
        "code": 400,
        "message": "Invalid JSON input: " + str(request.get_data())
    }), 400


def processMemberBooking(booking):
    # Invoke the booking microservice
    print('\n-----Invoking booking microservice-----')

    # add passenger + flight info into booking db (hardcode for now)
    print('Booking summary:', booking)
    passport = booking["passport"]
    flightNumber = booking["flightNumber"]
    bookingId = passport+flightNumber
    create_booking = invoke_http(booking_URL + "/" + bookingId, method='POST', json=booking)

    # Check the booking result; if a failure, send it to the error microservice.
    code = create_booking["code"]

    if code not in range(200, 300):
        # Inform the error microservice
        print('\n\n-----Publishing the (booking error) message with routing_key=booking.error-----')
        message = json.dumps(create_booking)
        amqp_setup_email.channel.basic_publish(exchange=amqp_setup_email.exchangename, routing_key="booking.error", 
            body=message, properties=pika.BasicProperties(delivery_mode = 2))

        print("\nBooking status ({:d}) published to the RabbitMQ Exchange:".format(code), create_booking)

        # Return error
        return {
            "code": 400,
            "data": {
                "create_booking": create_booking
            },
            "message": "Booking record error sent for error handling."
        }

    # Return created booking record
    return {
        "code": 201,
        "data": {
            "create_booking": create_booking
        },
        "message": "Booking record has been created."
    }


def processGuestBooking():
    return "ask them to login first"


if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) + " for makeing a booking...")
    app.run(host="0.0.0.0", port=5100, debug=True)