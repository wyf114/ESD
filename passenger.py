from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import sys
from os import environ
from flask_cors import CORS


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# check os and change sql setting respectively
# my_os=sys.platform
# if my_os == "darwin":
#     app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:root@localhost:3306/passenger'
# elif my_os == "win32" or my_os == "win64":
#     app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root@localhost:3306/passenger'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

CORS(app)  

# passenger table setup
class Passenger(db.Model):
    __tablename__ = 'passenger'  
    email = db.Column(db.String(50), nullable=False, primary_key=True)
    passport = db.Column(db.String(50), nullable=False)
    lastname = db.Column(db.String(100), nullable=False)
    firstname = db.Column(db.String(100), nullable=False)
    dob = db.Column(db.String(20), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    nationality = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(50), nullable=False)

    def __init__(self, email, passport, lastname, firstname, dob, gender, nationality, phone):
        self.email = email
        self.passport = passport
        self.lastname = lastname
        self.firstname = firstname
        self.dob = dob
        self.gender = gender
        self.nationality = nationality
        self.phone = phone

    def json(self):
        return {"email": self.email, "passport": self.passport, "lastname": self.lastname, "firstname": self.firstname, 
        "dob": self.dob, "gender": self.gender, "nationality": self.nationality, "phone": self.phone}

# get all passengers from db
@app.route("/passenger")
def get_all():
    passengerProfile = Passenger.query.all()
    if len(passengerProfile):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "passengers": [passenger.json() for passenger in passengerProfile]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Oops. No passenger found."
        }
    ),404

# get passengers by email
@app.route("/passenger/<string:email>")
def find_by_email(email):
    passenger = Passenger.query.filter_by(email=email).first()
    if passenger:
        return jsonify(
            {
                "code": 200,
                "data": passenger.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Passenger not found."
        }
    ), 404

# create new passenger
@app.route("/passenger/<string:email>", methods=['POST'])
def create_passenger(email):
    if Passenger.query.filter_by(email=email).first():
        return jsonify(
            {
                "code": 400,
                "data": {
                    "email": email
                },
                "message": "Passenger already exists."
            }
        ), 400

    data = request.get_json(force=True)
    print("data is " + format(data))
    passenger = Passenger(email, **data)

    try:
        db.session.add(passenger)
        db.session.commit()
    except:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "email": email
                },
                "message": "An error occurred creating the passenger."
            }
        ), 500

    return jsonify(
        {
            "code": 201,
            "data": passenger.json()
        }
    ), 201

if __name__ == '__main__':
    # host=’0.0.0.0’ allows the service to be accessible from any other in the network 
    # and not only from your own computer
    app.run(host='0.0.0.0', port=5000, debug=True)


# export dbURL=mysql+mysqlconnector://root:root@localhost:3306/passenger

