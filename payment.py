from flask import Flask, request, jsonify, render_template, session, redirect
import json
from flask_cors import CORS

app = Flask(__name__) 
CORS(app)

@app.route('/')
def index():
    return render_template('payment.html')

@app.route('/processPayment/paymentData',methods=['POST'])
def processPayment():
    paymentData=request.json
    print('Payment info received')
    print("payer given name: " ,{paymentData['payer']['name']['given_name']})
    print("payment id: " ,{paymentData['id']})
    return paymentData
   

if __name__ == '__main__':
    # host=’0.0.0.0’ allows the service to be accessible from any other in the network 
    # and not only from your own computer
    app.run(port=5005, debug=True)
