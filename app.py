from flask import Flask, render_template, jsonify, request
import requests 
import paypalrestsdk
from os import environ

app = Flask(__name__)
booking_URL = environ.get('booking_URL') or "http://localhost:5001/booking"


paypalrestsdk.configure({
  "mode": "sandbox", # sandbox or live
  "client_id": "AT56hDVWmazO8Tonu_EnKg6SwHSLsoCwRXdQzETmPLETf35rSYjChkUIOqDjP8WYNAx85hEDYXt96thg",
  "client_secret": "ELW-7JEfpX8yDDQImzYcxE2OpWkv4J502VhoBWusMz0iZMiu8zo5YB5A0kLpIWZZDKnD9t4LynXB8-8f" })

@app.route('/')
def index():
    return render_template('index.html')
    # print('hello')

@app.route('/payment', methods=['POST'])
def payment():

    payment = paypalrestsdk.Payment({
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"},
        "redirect_urls": {
            "return_url": "http://localhost:5003/payment/execute",
            "cancel_url": "http://localhost:5003/"},
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "testitem",
                    "sku": "12345",
                    "price": "10.00",
                    "currency": "USD",
                    "quantity": 1}]},
            "amount": {
                "total": "10.00",
                "currency": "USD"},
            "description": "This is the payment transaction description."}]})
    

    if payment.create():
        
        print('Payment success!')
    else:
        print(payment.error)

    return jsonify({'paymentID' : payment.id})

@app.route('/execute', methods=['POST'])
def execute():
    # global success 
    success = False

    payment = paypalrestsdk.Payment.find(request.form['paymentID'])

    if payment.execute({'payer_id' : request.form['payerID']}):
        print('Execute success!')
        success = True
    else:
        print(payment.error)

    return jsonify({'success' : success})

print(payment)

if __name__ == '__main__':
    # app.run(debug=True)
    app.run(host="0.0.0.0", port=5003, debug=True)

requests.post("http://localhost:5100/make_booking",data ={"status":"success"})