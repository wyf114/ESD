from flask import Flask, request, jsonify
from flask_cors import CORS
import os, sys
import requests
from invokes import invoke_http
import json

# import amqp_setup
# import pika
# import json

app = Flask(__name__)
CORS(app)

passenger_URL = "http://localhost:5000/passenger"
booking_URL = "http://localhost:5001/booking"
activity_log_URL = "http://localhost:5003/activity_log"
error_URL = "http://localhost:5004/error"

# email_URL = 
#validation_URL = 
#...

@app.route("/make_booking", methods=['POST'])
def make_booking():
    if request.is_json:
        try:
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
    # Get the booking info {booking ID}
    # Invoke the passenger microservice
    print('\n-----Invoking passenger microservice-----')
    print(booking)
        
    # assume the user has logged in and has filled up his info
    # invoke passenger microservice to get the passenger info by email
    email = booking["email"]
    get_passenger = invoke_http(passenger_URL + "/" + email, method='GET')
    print('result:', get_passenger)

    # record the activity log anyway
    print('\n\n-----Invoking activity_log microservice-----')
    invoke_http(activity_log_URL, method="POST", json=get_passenger)
    print("\nget_passenger sent to activity log.\n")
    # - reply from the invocation is not used;
    # continue even if this invocation fails

    # Check the get_passenger result; if a failure, send it to the error microservice.
    code = get_passenger["code"]
    if code not in range(200, 300):

        # if no data found in the passenger db, 
        # manual create booking info, and save passenger data into db
        if code == 404:
            # this part is gotten from UI form
            first_time_booking_user = {"passport": "W36545625", "lastname": "wang", "firstname": "faye", 
                "dob": "08/08/1969", "gender": "Female", "nationality": "Chinese", "phone": "+8618473649205"}
            first_time_booking_flight = {"flightNumber":'MF8765', "departureDate": '2022-05-20',
                "departureCity": 'Singapore', "arrivalCity": 'Beijing', "flightClass": 'Business', 
                "baggage": '20kg', "price": '500.00', "bookingStatus": 'Pending'}


            first_time_booking = {**first_time_booking_user, **first_time_booking_flight}
            first_time_booking["email"] = booking["email"]
            passport = first_time_booking["passport"]
            flightNumber = first_time_booking["flightNumber"]
            bookingId = passport+flightNumber

            create_user = invoke_http(passenger_URL + "/" + booking["email"], method='POST', json=first_time_booking_user)
            create_first_time_booking = invoke_http(booking_URL + "/" + bookingId, method='POST', json=first_time_booking)

                # record the activity log anyway
            print('\n\n-----Invoking activity_log microservice-----')
            invoke_http(activity_log_URL, method="POST", json=create_first_time_booking)
            invoke_http(activity_log_URL, method="POST", json=create_user)

            print("\nBooking sent to activity log.\n")
            # - reply from the invocation is not used;
            # continue even if this invocation fails
        
            # Check the booking result; if a failure, send it to the error microservice.
            code = create_first_time_booking["code"]
            if code not in range(200, 300):
            
                # Inform the error microservice
                print('\n\n-----Invoking error microservice as booking fails-----')
                invoke_http(error_URL, method="POST", json=create_first_time_booking)
                invoke_http(error_URL, method="POST", json=create_user)
                # - reply from the invocation is not used; 
                # continue even if this invocation fails
                print("Booking status ({:d}) sent to the error microservice:".format(
                    code), create_first_time_booking)
        
                # 7. Return error
                return {
                    "code": 500,
                    "data": {"booking_result": create_first_time_booking, "passenger_creation": create_user},
                    "message": "Booking creation failure sent for error handling."
                }
        
                # 7. Return created booking record
            return {
                "code": 201,
                "data": {
                    # "get_passenger_result": get_passenger,
                    "booking_result": create_first_time_booking, 
                    "passenger_creation": create_user
                }
            }

        # Inform the error microservice
        print('\n\n-----Invoking error microservice as get_passenger fails-----')
        invoke_http(error_URL, method="POST", json=get_passenger)
        # - reply from the invocation is not used; 
        # continue even if this invocation fails
        print("get_passenger status ({:d}) sent to the error microservice:".format(
            code), get_passenger)

        # 7. Return error
        return {
            "code": 500,
            "data": {"get_passenger_result": get_passenger},
            "message": "get_passenger failure sent for error handling."
        }
    
    print('\n-----Invoking booking microservice-----')

    # assume gotten flight info from UI
    # add passenger + flight info into booking db
    flight_info = {"flightNumber":'MF1314', "departureDate": '2022-05-20',
    "departureCity": 'Singapore', "arrivalCity": 'Beijing', "flightClass": 'Business', 
    "baggage": '20kg', "price": '500.00', "bookingStatus": 'Pending'}
    passenger_info = get_passenger["data"]
    booking_info = {**passenger_info, **flight_info}
    print('Booking summary:', booking_info)
    passport = booking_info["passport"]
    flightNumber = booking_info["flightNumber"]
    bookingId = passport+flightNumber
    create_booking = invoke_http(booking_URL + "/" + bookingId, method='POST', json=booking_info)

    # print('result:', create_booking)

    # record the activity log anyway
    print('\n\n-----Invoking activity_log microservice-----')
    invoke_http(activity_log_URL, method="POST", json=create_booking)
    print("\nBooking sent to activity log.\n")
    # - reply from the invocation is not used;
    # continue even if this invocation fails

    # Check the booking result; if a failure, send it to the error microservice.
    code = create_booking["code"]
    if code not in range(200, 300):

        # Inform the error microservice
        print('\n\n-----Invoking error microservice as booking fails-----')
        invoke_http(error_URL, method="POST", json=create_booking)
        # - reply from the invocation is not used; 
        # continue even if this invocation fails
        print("Booking status ({:d}) sent to the error microservice:".format(
            code), create_booking)

        # 7. Return error
        return {
            "code": 500,
            "data": {"booking_result": create_booking},
            "message": "Booking creation failure sent for error handling."
        }

        # 7. Return created booking record
    return {
        "code": 201,
        "data": {
            # "get_passenger_result": get_passenger,
            "booking_result": create_booking
        }
    }


def processGuestBooking():
    return "ask them to login first"




# validation part, check if the database have sufficient slots
# 
# 
# 
# to be done




if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) + " for makeing a booking...")
    app.run(host="0.0.0.0", port=5100, debug=True)