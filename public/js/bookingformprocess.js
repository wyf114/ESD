function showPassenger() {
    let email = localStorage.getItem('email');
    // email="tianjingsun.2020@smu.edu.sg"
    // email = "wyf103@gmail.com";
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
                lastName.value = passenger_info[0].lastname;
                firstName.value = passenger_info[0].firstname;
                nationality.value = passenger_info[0].nationality;
                dob.value = passenger_info[0].dob;
                passport.value = passenger_info[0].passport;
                phone.value = passenger_info[0].phone;
                if (passenger_info[0].gender = "Female") {
                    female.checked = true;
                } else {
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
    // console.log(gender);
    let nationality = document.getElementById("nationality").value;
    let dob = document.getElementById("dob").value;
    let passport = document.getElementById("passport").value;
    let email = document.getElementById("emailTxt").textContent;
    console.log(email);
    let phone = document.getElementById("phone").value;
    let genderList = document.getElementsByName("gender");
    let valiTxt = document.getElementById("valiTxt");
    var genderchecked = [];
    for (var g of genderList) {
        if (g.checked) {
            gender = g.value;
            genderchecked.push(g.value);
        }
    }
    var paymentInfo = [price, email];
    localStorage.setItem("paymentInfo", paymentInfo);
    console.log(localStorage.getItem("paymentInfo"));
    if (lastName == '') {

        valiTxt.innerHTML = "Please enter your last name.";
        setTimeout(() => { valiTxt.innerHTML = "" }, 2000);
    } else if (firstName == '') {
        valiTxt.innerHTML = "Please enter your first name.";
        setTimeout(() => { valiTxt.innerHTML = "" }, 2000);
    } else if (genderchecked.length == 0) {
        valiTxt.innerHTML = "Please enter your gender.";
        setTimeout(() => { valiTxt.innerHTML = "" }, 2000);
    } else if (nationality == '') {
        valiTxt.innerHTML = "Please enter your nationality.";
        setTimeout(() => { valiTxt.innerHTML = "" }, 2000);
    } else if (dob == '') {
        valiTxt.innerHTML = "Please enter your date of birth.";
        setTimeout(() => { valiTxt.innerHTML = "" }, 2000);
    } else if (passport == '') {
        valiTxt.innerHTML = "Please enter your passport.";
        setTimeout(() => { valiTxt.innerHTML = "" }, 2000);
    } else if (phone == '') {
        valiTxt.innerHTML = "Please enter your phone.";
        setTimeout(() => { valiTxt.innerHTML = "" }, 2000);
    } else {
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
            .then(async response => {
                try {
                    const data = await response.json();
                    console.log(data);
                    let bookingInfo=data.data.create_booking.data.bookingId;
                    console.log(bookingInfo);
                    localStorage.setItem('bookingInfo',bookingInfo);
                    code = data.code;
                    console.log(code);
                    if (code < 300 && code >= 200) {
                        window.location.href = "./payment.html";
                    }else if (code == 410) {
                        valiTxt.innerHTML = "Booking Existed.";
                        setTimeout(() => { valiTxt.innerHTML = "" }, 2000);
                    } 
                    else if (code == 501) {
                        valiTxt.innerHTML = "Booking Not Successful.";
                        setTimeout(() => { valiTxt.innerHTML = "" }, 2000);
                    } else if (code == 500) {
                        valiTxt.innerHTML = "Invalid data format.";
                        setTimeout(() => { valiTxt.innerHTML = "" }, 2000);
                    }
                    else {
                        valiTxt.innerHTML = "Unsuccessful booking, please check with system admin.";
                        setTimeout(() => { valiTxt.innerHTML = "" }, 2000);
                    }
                }
                catch (error) {
                    console.log("Problem in making a booking. " + error);
                    valiTxt.innerHTML = "Unsuccessful booking, please check with system admin.";
                    setTimeout(() => { valiTxt.innerHTML = "" }, 2000);
                }
            })
    }
}

