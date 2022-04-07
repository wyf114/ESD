import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from invokes import invoke_http
import os, sys
import requests
import json
from os import environ
import time
app = Flask(__name__)
CORS(app, allow_headers=['Content-Type', 'Access-Control-Allow-Origin',
                         'Access-Control-Allow-Headers', 'Access-Control-Allow-Methods'])



booking_URL = environ.get('booking_URL') or "http://localhost:5001/booking"

@app.route("/validation", methods=['POST'])
def validation():
    # assume result a json in {bookingId: bookingId, countDown: Countdown, bookingStatus: Cancelled}
    count = request.get_json(force=True)
    print(count)
    if count['countDown']== "Countdown":
        result = countDown(count)
        return jsonify(result), result["code"]

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
            "data": str(data),
            "message": "Payment info should be in JSON."}), 100 


def validateBooking(payment_info):
    print("Validating the booking:", payment_info)
    bookingId = payment_info['bookingId']
    paymentStatus = payment_info['paymentStatus']
    if paymentStatus == "Completed":
        payment_info['paymentStatus'] = "Confirmed"
        print(payment_info)
        updateBooking = invoke_http(booking_URL + "/" + bookingId, method='PUT', json=payment_info)
        code = updateBooking["code"]
        print(code)
        if code not in range(200, 300):
            code = code
            message = 'Failure in booking status update.'
        else:  
            code = code
            message = 'Success in booking status update.'

        return {
            "code": code,
            "data": {
                "updateBooking": updateBooking
            },
            "message": "Payment successful."
        }   

    else:
        payment_info['paymentStatus'] = "Cancelled"
        print(payment_info)
        updateBooking = invoke_http(booking_URL + "/" + bookingId, method='PUT', json=payment_info)
        code = updateBooking["code"]
        print(code)
        if code not in range(200, 300):
            code = code
            message = 'Failure in booking status update.'
        else:  
            code = code
            message = 'Success in booking status update.'

        print(message)
        print()  

        return {
            "code": code,
            "data": {
                "updateBooking": updateBooking
            },
            "message": "Payment failed and your flight is cancelled."
        }   

def countDown(count):
    bookingId = count['bookingId']
    bookingStatus = count['bookingStatus']
    # time in seconds: 20 mins * 60 sec = 1200 sec
    t = 10
    while t:
        mins, secs = divmod(t, 60)
        timer = '{:02d}:{:02d}'.format(mins, secs)
        print(timer, end="\r")
        time.sleep(1)
        t -= 1
    
    getStatus = invoke_http(booking_URL + "/" + bookingId, method='GET')
    print(getStatus)
    booking = getStatus['data']
    status = booking['bookingStatus']
    if status != "Confirmed":
        changeStatus = invoke_http(booking_URL + "/" + bookingId, method='PUT', json=bookingStatus)

        return {
            "code": changeStatus['code'],
            "message": json.dumps(changeStatus),
            "bookingId": bookingId,
            "status": "cancel"
        }
  
  
# execute this program only if it is run as a script (not by 'import')
if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) +
          ": shipping for orders ...")
    app.run(host='0.0.0.0', port=5002, debug=True)
