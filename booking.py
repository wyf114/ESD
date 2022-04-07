import email
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS
import sys
from os import environ
import json


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL')

# check os and change sql setting respectively
# my_os=sys.platform
# if my_os == "darwin":
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:root@localhost:3306/booking'
# elif my_os == "win32" or my_os == "win64":
#     app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root@localhost:3306/booking'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

CORS(app, allow_headers=['Content-Type', 'Access-Control-Allow-Origin',
                         'Access-Control-Allow-Headers', 'Access-Control-Allow-Methods'])


################## to be done #############
# booking table setup
class Booking(db.Model):
    __tablename__ = 'booking'
    bookingId = db.Column(db.String(100), nullable=False, primary_key=True)
    passport = db.Column(db.String(50), nullable=False)
    lastname = db.Column(db.String(100), nullable=False)
    firstname = db.Column(db.String(100), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    nationality = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    flightNumber = db.Column(db.String(50), nullable=False)
    departureDate = db.Column(db.Date, nullable = False)
    departureCity = db.Column(db.String(100), nullable=False)
    arrivalCity = db.Column(db.String(100), nullable=False) 
    departureTime = db.Column(db.String(100), nullable=False) 
    arrivalTime = db.Column(db.String(100), nullable=False) 
    flightNumber2 = db.Column(db.String(50), nullable=False)
    departureDate2 = db.Column(db.Date, nullable = False)
    departureCity2 = db.Column(db.String(100), nullable=False)
    arrivalCity2 = db.Column(db.String(100), nullable=False) 
    departureTime2 = db.Column(db.String(100), nullable=False) 
    arrivalTime2 = db.Column(db.String(100), nullable=False) 
    price = db.Column(db.Float, nullable=False) 
    bookingStatus = db.Column(db.String(50), nullable=False)

    def __init__(self, bookingId, passport, lastname, firstname, dob, gender, nationality, email, phone, 
    flightNumber, departureDate, departureCity, arrivalCity, departureTime, arrivalTime, flightNumber2, departureDate2, departureCity2, arrivalCity2, departureTime2, arrivalTime2, price, bookingStatus):
        self.bookingId = bookingId
        self.passport = passport
        self.lastname = lastname
        self.firstname = firstname
        self.dob = dob
        self.gender = gender
        self.nationality = nationality
        self.email = email
        self.phone = phone
        self.flightNumber = flightNumber
        self.departureDate = departureDate
        self.departureCity = departureCity
        self.arrivalCity = arrivalCity
        self.departureTime = departureTime
        self.arrivalTime=arrivalTime
        self.flightNumber2 = flightNumber2
        self.departureDate2 = departureDate2
        self.departureCity2 = departureCity2
        self.arrivalCity2 = arrivalCity2
        self.departureTime2 = departureTime2
        self.arrivalTime2=arrivalTime2
        self.price = price
        self.bookingStatus = bookingStatus

    def json(self):
        return {"bookingId": self.bookingId, "passport": self.passport, "lastname": self.lastname, "firstname": self.firstname, 
        "dob": self.dob, "gender": self.gender, "nationality": self.nationality, 
        "email": self.email, "phone": self.phone, 
        "flightNumber":self.flightNumber, "departureDate": self.departureDate,
        "departureCity": self.departureCity, "arrivalCity": self.arrivalCity, 
        "departureTime": self.departureTime, "arrivalTime":self.arrivalTime,
        "flightNumber2":self.flightNumber2, "departureDate2": self.departureDate2,
        "departureCity2": self.departureCity2, "arrivalCity2": self.arrivalCity2, 
        "departureTime2": self.departureTime2, "arrivalTime2":self.arrivalTime2,
         "price": self.price, "bookingStatus": self.bookingStatus}

# get all bookings from db
@app.route("/booking")
def get_all():
    bookingList = Booking.query.all()
    print(bookingList)
    if len(bookingList):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "bookings": [booking.json() for booking in bookingList]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Oops. No booking found in the booking database."
        }
    ),404

# get bookings by bookingId/email
@app.route("/booking/<string:condition>")
def find_by_condition(condition):
    if "@" in condition:
        myBookingList = Booking.query.filter_by(email=condition).all()
        if len(myBookingList):
            # myBookingList = json.dumps(myBookingList, default=str)
            print(myBookingList)
            return jsonify(
                {
                    "code": 200,
                    "data": {
                        "bookings": [booking.json() for booking in myBookingList]
                    }
                }
            )
        return jsonify(
            {
                "code": 404,
                "message": "No booking found by this email."
            }
        ),404
    else:
        booking = Booking.query.filter_by(bookingId=condition).first()
        if booking:
            booking = json.dumps(booking, default=str)
            return jsonify(
                {
                    "code": 200,
                    "data": booking
                }
            )
        return jsonify(
            {
                "code": 404,
                "message": "No booking found by this bookingId."
            }
        ), 404

# create new booking
@app.route("/booking/<string:bookingId>", methods=['POST'])
def create_booking(bookingId):
    if Booking.query.filter_by(bookingId=bookingId).first():
        return jsonify(
            {
                "code": 410,
                "data": {
                    "bookingId": bookingId
                },
                "message": "Booking already exists."
            }
        ), 410

    data = request.get_json(force=True)
    print("data is " + format(data))
    booking = Booking(bookingId, **data)

    try:
        db.session.add(booking)
        db.session.commit()
    except:
        return jsonify(
            {
                "code": 501,
                "data": {
                    "bookingId": bookingId
                },
                "message": "An error occurred creating the booking."
            }
        ), 501

    booking = json.dumps(booking, default=str)
    return jsonify(
        {
            "code": 201,
            "data": booking
        }
    ), 201

# update booking by bookingId
@app.route("/booking/<string:bookingId>", methods=['PUT'])
def update_booking(bookingId):
    booking = Booking.query.filter_by(bookingId=bookingId).first()
    print(booking)
    if booking:
        print(booking)
        bookingStatus = request.get_json(force=True)
        print("data is " + format(bookingStatus))
        booking.bookingStatus = bookingStatus["paymentStatus"]
    try:
        db.session.commit()
    except:
        return jsonify(
            {
                "code": 502,
                "data": {
                    "bookingId": bookingId
                },
                "message": "An error occurred updating the booking."
            }
        ), 502
    
    booking = json.dumps(booking, default=str)
    return jsonify(
        {
            "code": 202,
            "data": booking
        }
    ), 202


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
