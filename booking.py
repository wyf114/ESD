from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS
import sys
from os import environ


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# check os and change sql setting respectively
my_os=sys.platform
if my_os == "darwin":
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:root@localhost:3306/booking'
elif my_os == "win32" or my_os == "win64":
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root@localhost:3306/booking'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

CORS(app)  


################## to be done #############
# booking table setup
class Booking(db.Model):
    __tablename__ = 'booking'
    passport = db.Column(db.String(50), nullable=False, primary_key=True)
    lastname = db.Column(db.String(100), nullable=False)
    firstname = db.Column(db.String(100), nullable=False)
    dob = db.Column(db.String(20), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    nationality = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    flightNumber = db.Column(db.String(50), nullable=False)
    departureDate = db.Column(db.Date, nullable = False)
    # departureTime = db.Column(db.TIMESTAMP, nullable = False)
    departureCity = db.Column(db.String(100), nullable=False)
    arrivalCity = db.Column(db.String(100), nullable=False) 
    flightClass = db.Column(db.String(50), nullable=False)
    baggage = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False) 
    bookingStatus = db.Column(db.String(50), nullable=False)

    def __init__(self, passport, lastname, firstname, dob, gender, nationality, email, phone, 
    flightNumber, departureDate, departureCity, arrivalCity, flightClass, baggage, price, bookingStatus):
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
        # self.departureTime = departureTime
        self.departureCity = departureCity
        self.arrivalCity = arrivalCity
        self.flightClass = flightClass
        self.baggage = baggage
        self.price = price
        self.bookingStatus = bookingStatus

    def json(self):
        return {"passport": self.passport, "lastname": self.lastname, "firstname": self.firstname, 
        "dob": self.dob, "gender": self.gender, "nationality": self.nationality, 
        "email": self.email, "phone": self.phone, "flightNumber":self.flightNumber, "departureDate": self.departureDate,
        # "departureTime": self.departureTime, 
        "departureCity": self.departureCity, "arrivalCity": self.arrivalCity,
        "flightClass": self.flightClass, "baggage": self.baggage, "price": self.price, "bookingStatus": self.bookingStatus}

# get all bookings from db
@app.route("/booking")
def get_all():
    bookingList = Booking.query.all()
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
            "message": "Oops. No booking found."
        }
    ),404

# get bookings by passport
@app.route("/booking/<string:passport>")
def find_by_passport(passport):
    booking = Booking.query.filter_by(passport=passport).first()
    if booking:
        return jsonify(
            {
                "code": 200,
                "data": booking.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Booking not found."
        }
    ), 404

# create new booking
@app.route("/booking/<string:passport>", methods=['POST'])
def create_booking(passport):
    if Booking.query.filter_by(passport=passport).first():
        return jsonify(
            {
                "code": 400,
                "data": {
                    "passport": passport
                },
                "message": "Booking already exists."
            }
        ), 400

    data = request.get_json(force=True)
    print("data is " + format(data))
    booking = Booking(passport, **data)

    try:
        db.session.add(booking)
        db.session.commit()
    except:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "passport": passport
                },
                "message": "An error occurred creating the booking."
            }
        ), 500

    return jsonify(
        {
            "code": 201,
            "data": booking.json()
        }
    ), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
