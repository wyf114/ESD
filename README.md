# ESD
ESD Project - Airline Web

How to set up:
1. Run "docker-compose up --build -d" after change to your own docker id
2. Download live server in Visual Studio code
3. Configure the port to 5500 (optional, since 5500 by default)
4. Click on Go Live at the bottom right corner
5. Setup is done, you are ready to explore our Airline Web!

How to use:
#### This is the first microservice and also an external flight booking API ####
1. Select a departure city such as Singapore, then select the one with SIN code 
2. Select a arrival city such as Bangkok, then select the one with BKK code (you are free to explain other cities, just that there are limited flight available due to Covid, and you may not be able to find a flight for the destination.
3. Select Departure and Return data accordingly, the rest can be left default
4. Click Check Availability
4. You need to select both depart and return flights 

#### This is our main complex microservice make_booking with its related atomic microservices ####
1. When you enter the bookingForm page, it will auto-trigger the passenger microservice by GET to auto-fill the personal info if the user data has been stored in the DB before.
2. Click the Booking button, it will trigger the make_booking complex microservice to call the booking DB to store the flight info in if the record does not exist. 
3. Your personal info will be stored into the passenger DB if it's not in it (the make_booking complex microservice will auto call the passenger microservice after creating the new booking record)

#### This is make_booking with validation microservice and PayPal API ####
4. You are ready for payment by clicking on the payment button
5. you will be directed to Paypal API, click pay, and then the payment status will be sent to the complex microservice 
6. The complex microservice will call the validation microservice to check payment result and update the status in booking DB accordingly.
7. The result will be returned to UI for informing purpose.

#### We also have a My Booking Page for passengers to check or cancel their booking ####
