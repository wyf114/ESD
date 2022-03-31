# test_invoke_http.py
from invokes import invoke_http

# invoke book microservice to get all books
results = invoke_http("http://localhost:5000/passenger", method='GET')

print( type(results) )
print()
print( results )

# invoke book microservice to create a book
passport = 'G34636346'

booking_details = {"lastname": "last", "firstname": "first", 
    "dob": "02/10/1988", "gender": "Female", "nationality": "Singapore", 
    "email": "last@gmail.com", "phone": "+659485763"}
create_booking = invoke_http("http://localhost:5000/passenger/" + passport, method='POST', 
json=booking_details
)


print()
print( create_booking )
