# sending sms from messaging service created with twilio phone number 
import os
from twilio.rest import Client



# Find your Account SID and Auth Token at twilio.com/console
# and set the environment variables. See http://twil.io/secure
account_sid = os.environ['TWILIO_ACCOUNT_SID']
auth_token = os.environ['TWILIO_AUTH_TOKEN']
client = Client(account_sid, auth_token)

message = client.messages \
    .create(
         messaging_service_sid='MGee106bac97b98c0326a9e3e159314ef2',
         body='TEST 123 ESD FLIGHT',
         to='+6597364576'  #my number

     )

print(message.sid)


# set TWILIO_ACCOUNT_SID=AC4bbaea410ab4503dec12265918cbbc49
# set TWILIO_AUTH_TOKEN=56d1d56b4bc4502fc9da6a7a03be7ab5