function showPassenger() {
    // let email = document.getElementById("emailTxt").textContent;
    // email="tianjingsun.2020@smu.edu.sg"
    email = "wyf102@gmail.com";
    console.log(email);
    let passenger_URL = "http://localhost:5000/passenger"
    const response =
        fetch(`${passenger_URL}/${email}`)
            .then(response => response.json())
            .then(data => {
                console.log(response);
                if (data.code === 404) {
                    // no passenger in db
                    passenger_info = [];
                } else {
                    passenger_info = [data.data];
                    console.log(data);
                    console.log(passenger_info);
                    
                }
                let lastName = document.getElementById("lastname");
                let firstName = document.getElementById("firstname");
                let nationality = document.getElementById("nationality");
                let dob = document.getElementById("dob");
                let passport = document.getElementById("passport");
                let email = document.getElementById("email");
                let phone = document.getElementById("phone");
                let female = document.getElementById("female");
                let male = document.getElementById("male");
                lastName.value=passenger_info[0].lastname;
                firstName.value=passenger_info[0].firstname;
                nationality.value=passenger_info[0].nationality;
                dob.value=passenger_info[0].dob;
                passport.value=passenger_info[0].passport;
                email.value=passenger_info[0].email;
                phone.value=passenger_info[0].phone;
                if(passenger_info[0].gender="Female"){
                    female.checked = true;
                }else{
                    male.checked = true;
                }
            })
            .catch(error => {
                // Errors when calling the service; such as network error, 
                // service offline, etc
                console.log(error);

            });
    console.log(localStorage.getItem("flightInfo").split(","));
    let flightInfo = localStorage.getItem("flightInfo").split(",");
    document.getElementById("flightNumber").innerHTML = flightInfo[0];
    document.getElementById("departTime").innerHTML = flightInfo[1];
    document.getElementById("arriveTime").innerHTML = flightInfo[2];
    document.getElementById("originCode").innerHTML = flightInfo[3];
    document.getElementById("desCode").innerHTML = flightInfo[4];
    document.getElementById("departDate").innerHTML = flightInfo[5];
    document.getElementById("price").innerHTML = flightInfo[6];
}




function confirmBooking() {
    let flightNumber = document.getElementById("flightNumber").textContent;
    let departTime = document.getElementById("departTime").textContent;
    let arriveTime = document.getElementById("arriveTime").textContent;
    let originCode = document.getElementById("originCode").textContent;
    let desCode = document.getElementById("desCode").textContent;
    let departDate = document.getElementById("departDate").textContent;
    let price = document.getElementById("price").textContent;
    let lastName = document.getElementById("lastname").value;
    let firstName = document.getElementById("firstname").value;
    let genderList = document.getElementsByName("gender");
    for (var g of genderList) {
        if (g.checked) {
            gender = g.value;
        }
    }
    console.log(gender);
    let nationality = document.getElementById("nationality").value;
    let dob = document.getElementById("dob").value;
    let passport = document.getElementById("passport").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    var paymentInfo=[price,email];
    localStorage.setItem("paymentInfo", paymentInfo);
    console.log(localStorage.getItem("paymentInfo"));
    let makeBooking_URL = "http://localhost:5100/make_booking";
    fetch(makeBooking_URL,
        {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(
                {
                    "flightNumber": flightNumber,
                    "departureTime": departTime,
                    "arrivalTime": arriveTime,
                    "departureCity": originCode,
                    "arrivalCity": desCode,
                    "departureDate": departDate,
                    "price": price,
                    "lastname": lastName,
                    "firstname": firstName,
                    "gender": gender,
                    "nationality": nationality,
                    "dob": dob,
                    "passport": passport,
                    "email": email,
                    "phone": phone,

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

