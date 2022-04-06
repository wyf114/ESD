// booking history
function retriveBooking(){
    // let email = document.getElementById("emailTxt").textContent;
    let email = localStorage.getItem('email');
    const get_all_bookings_URL = "http://localhost:5001/booking";
    const response = 
    fetch(`${get_all_bookings_URL}/${email}`)
            .then( response => response.json())
            .then(data => {
                
                console.log(data);
                if (data.code === 404) {
                    // no booking in db
                    document.getElementById('message').innerText = 'No Past Booking'
                    booking = [];
                } else {
                    booking_obj = data.data.bookings;
                    console.log("data",data);
                    console.log("booking", booking_obj);
                    
                }
                
                let info = document.getElementById("info");
                var str = '';
                for (let i=0;i<booking_obj.length;i++){
                    str += `<div class="col-sm" id="${i}">`
                    let bookingId=booking_obj[i].bookingId
                    let lastname = booking_obj[i].lastname 
                    let firstname = booking_obj[i].lastname
                    let passport = booking_obj[i].passport
                    let email = booking_obj[i].email
                    let phone = booking_obj[i].phone
                    let flightNumber = booking_obj[i].flightNumber
                    let departureDate = booking_obj[i].departureDate
                    let departureCity = booking_obj[i].departureCity       
                    let arrivalCity = booking_obj[i].arrivalCity
                    let departureTime = booking_obj[i].departureTime
                    let arrivalTime = booking_obj[i].arrivalTime
                    let flightNumber2 = booking_obj[i].flightNumber2
                    let departureDate2 = booking_obj[i].departureDate2
                    let departureCity2 = booking_obj[i].departureCity2  
                    let arrivalCity2 = booking_obj[i].arrivalCity2
                    let departureTime2 = booking_obj[i].departureTime2
                    let arrivalTime2 = booking_obj[i].arrivalTime2
                    let price = booking_obj[i].price
                    // let flightClass = booking_obj[i].flightClass         
    
                    str += `<p>Booking ${i+1}</p>
                        <p id="bookingId${i}">Booking ID: ${bookingId}</p>
                        <p>Last Name: ${lastname}</p>
                        <p>First Name: ${firstname}</p>
                        <p>Passport: ${passport}</p>
                        <p>Email: ${email}</p>
                        <p>Phone: ${phone}</p>
                        <p>Flight Number: ${flightNumber}</p>
                        <p>Departure Date: ${departureDate}</p>
                        <p>Departure City: ${departureCity}</p>
                        <p>Arrival City: ${arrivalCity}</p>
                        <p>Departure Time: ${departureTime}</p>
                        <p>Arrival Time: ${arrivalTime}</p></br>
                        <p>Return Flight: </p>
                        <p>Flight Number: ${flightNumber2}</p>
                        <p>Departure Date: ${departureDate2}</p>
                        <p>Departure City: ${departureCity2}</p>
                        <p>Arrival City: ${arrivalCity2}</p>
                        <p>Departure Time: ${departureTime2}</p>
                        <p>Arrival Time: ${arrivalTime2}</p>
                        <p>Price: ${price}</p>
                    </div> <input class="btn btn-primary mt-2" onclick = "onCancel(${i})" value="Cancel booking"/>`
                    info.innerHTML = str;
                }
                })
    
                .catch(error=> {
                // Errors when calling the service; such as network error, 
                // service offline, etc
                console.log(error);
            })
    }

    function onCancel(counter){
        let booking_URL = "http://localhost:5001/booking";
        let bookingId = document.getElementById(`bookingId${counter}`).textContent;
        console.log(bookingId);
    fetch(`${booking_URL}/${bookingId}`,
        {
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(
                {
                    "bookingId": bookingId,
                })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            result = data.data;
            console.log(result);

        })
        .catch(error => {
            console.log("Problem in making a booking. " + error);
        })
    }