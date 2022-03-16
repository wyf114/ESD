from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import sys

app = Flask(__name__)

# check os and change sql setting respectively
my_os=sys.platform
if my_os == "darwin":
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:root@localhost:3306/passenger'
elif my_os == "win32" or my_os == "win64":
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root@localhost:3306/passenger'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# passenger table setup
class Passenger(db.Model):
    __tablename__ = 'passenger'
    passport = db.Column(db.String(50), nullable=False, primary_key=True)
    lastname = db.Column(db.String(100), nullable=False)
    firstname = db.Column(db.String(100), nullable=False)
    dob = db.Column(db.String(20), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    nationality = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(50), nullable=False)

    def __init__(self, passport, lastname, firstname, dob, gender, nationality, email, phone):
        self.passport = passport
        self.lastname = lastname
        self.firstname = firstname
        self.dob = dob
        self.gender = gender
        self.nationality = nationality
        self.email = email
        self.phone = phone

    def json(self):
        return {"passport": self.passport, "lastname": self.lastname, "firstname": self.firstname, 
        "dob": self.dob, "gender": self.gender, "nationality": self.nationality, 
        "email": self.email, "phone": self.phone}

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
            "message": "There are no passengers."
        }
    ),404

if __name__ == '__main__':
    app.run(port=5000, debug=True)


