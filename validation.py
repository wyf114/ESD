import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from invokes import invoke_http
import os, sys
import requests
import json
from os import environ
import amqp_setup
import pika


app = Flask(__name__)
CORS(app)

booking_URL = environ.get('booking_URL') or "http://localhost:5001/booking"

@app.route("/validation", methods=['POST'])
def validation():
    # Check if the order contains valid JSON
    if request.is_json:
        payment_info = request.get_json(force=True)
        print("\nReceived a payment info in JSON:", payment_info)

        result = validateBooking(payment_info)
        return jsonify(result), result["code"]
    else:
        data = request.get_data()
        print("Received an invalid order:")
        print(data)
        return jsonify(
            {"code": 100,
            # make the data string as we dunno what could be the actual format
            "data": str(data),
            "message": "Payment info should be in JSON."}), 100  # Bad Request input


def validateBooking(payment_info):
    print("Validating the booking:", payment_info)
    bookingId = payment_info['bookingId']
    bookingStatus = payment_info['bookingStatus']
    # if bookingStatus == "Completed" or "Failed":
    updateBooking = invoke_http(booking_URL + "/" + bookingId, method='PUT', json=bookingStatus)

    # Check the update result; if a failure, send it to the error microservice.
    code = updateBooking["code"]

    if code not in range(200, 300):
        code = code
        message = 'Failure in booking status update.'
    else:  # simulate success
        code = code
        message = 'Success in booking status update.'

    print(message)
    print()  # print a new line feed as a separator

    return {
        'code': code,
        'data': {
            'bookingId': bookingId
        },
        'message': message
    }


# execute this program only if it is run as a script (not by 'import')
if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) +
          ": shipping for orders ...")
    app.run(host='0.0.0.0', port=5002, debug=True)
