function showPassenger() {
    let email = document.getElementById("emailTxt").textContent;
    // email="tianjingsun.2020@smu.edu.sg"
    // email = "wyf102@gmail.com";
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
                let phone = document.getElementById("phone");
                let female = document.getElementById("female");
                let male = document.getElementById("male");
                lastName.value=passenger_info[0].lastname;
                firstName.value=passenger_info[0].firstname;
                nationality.value=passenger_info[0].nationality;
                dob.value=passenger_info[0].dob;
                passport.value=passenger_info[0].passport;
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
            
    console.log(localStorage.getItem("fromFlightInfo").split(","));
    console.log(localStorage.getItem("toFlightInfo").split(","));
    let fromFlightInfo = localStorage.getItem("fromFlightInfo").split(",");
    let toFlightInfo = localStorage.getItem("toFlightInfo").split(",");
    document.getElementById("flightNumber").innerHTML = fromFlightInfo[0];
    document.getElementById("departTime").innerHTML = fromFlightInfo[1];
    document.getElementById("arriveTime").innerHTML = fromFlightInfo[2];
    document.getElementById("originCode").innerHTML = fromFlightInfo[3];
    document.getElementById("desCode").innerHTML = fromFlightInfo[4];
    document.getElementById("departDate").innerHTML = fromFlightInfo[5];
    document.getElementById("price").innerHTML = fromFlightInfo[6];

    document.getElementById("flightNumber2").innerHTML = toFlightInfo[0];
    document.getElementById("departTime2").innerHTML = toFlightInfo[1];
    document.getElementById("arriveTime2").innerHTML = toFlightInfo[2];
    document.getElementById("originCode2").innerHTML = toFlightInfo[3];
    document.getElementById("desCode2").innerHTML = toFlightInfo[4];
    document.getElementById("departDate2").innerHTML = toFlightInfo[5];
}




function confirmBooking() {

    let login = localStorage.getItem("loginID");
    if (login==null){
    window.alert("Please Sign in via Google!")
    return
    }

    


    let flightNumber = document.getElementById("flightNumber").textContent;
    let departTime = document.getElementById("departTime").textContent;
    let arriveTime = document.getElementById("arriveTime").textContent;
    let originCode = document.getElementById("originCode").textContent;
    let desCode = document.getElementById("desCode").textContent;
    let departDate = document.getElementById("departDate").textContent;

    let flightNumber2 = document.getElementById("flightNumber2").textContent;
    let departTime2 = document.getElementById("departTime2").textContent;
    let arriveTime2 = document.getElementById("arriveTime2").textContent;
    let originCode2 = document.getElementById("originCode2").textContent;
    let desCode2 = document.getElementById("desCode2").textContent;
    let departDate2 = document.getElementById("departDate2").textContent;

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
    let email = document.getElementById("emailTxt").textContent;
    console.log(email);
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
                    "flightNumber2": flightNumber2,
                    "departureTime2": departTime2,
                    "arrivalTime2": arriveTime2,
                    "departureCity2": originCode2,
                    "arrivalCity2": desCode2,
                    "departureDate2": departDate2,
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

