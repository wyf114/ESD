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

            # Get booking info {booking ID}
            result = processMakeBooking(booking)
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



def processMakeBooking(booking):
    # Get the booking info {booking ID}
    # Invoke the passenger microservice
    print('\n-----Invoking passenger microservice-----')


    # invoke book microservice to create a book
    # convert = json.loads(booking)[0]
    # passport = convert["passport"]
    create_booking = invoke_http(passenger_URL, method='POST', json=booking)
    print('result:', create_booking)

        # 4. Record new order
    # record the activity log anyway
    print('\n\n-----Invoking activity_log microservice-----')
    invoke_http(activity_log_URL, method="POST", json=create_booking)
    print("\nOrder sent to activity log.\n")
    # - reply from the invocation is not used;
    # continue even if this invocation fails

    # Check the order result; if a failure, send it to the error microservice.
    code = create_booking["code"]
    if code not in range(200, 300):

        # Inform the error microservice
        print('\n\n-----Invoking error microservice as order fails-----')
        invoke_http(error_URL, method="POST", json=create_booking)
        # - reply from the invocation is not used; 
        # continue even if this invocation fails
        print("Order status ({:d}) sent to the error microservice:".format(
            code), create_booking)

        # 7. Return error
        return {
            "code": 500,
            "data": {"order_result": create_booking},
            "message": "Order creation failure sent for error handling."
        }


    # validation part, check if the database have sufficient slots
    # 
    # 
    # 
    # to be done




if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) + " for makeing a booking...")
    app.run(host="0.0.0.0", port=5100, debug=True)