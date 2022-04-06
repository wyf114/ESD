

function showPayment(){
        var paymentData = JSON.parse(localStorage.getItem("paymentData"))
        // console.log('paymentdata',JSON.stringify(JSON.parse(localStorage.getItem("paymentData"))) )
        console.log((paymentData))
        var paymentId = paymentData.id
        var paymentStatus = paymentData.status
        console.log("paymentId",typeof(paymentId))
        // var email=localStorage.getItem("email");
        // console.log(localStorage.getItem("email"));
        var bookingId = 'MF5045Y12345678';
        // console.log("bookingid",JSON.parse(localStorage.getItem('bookingId')))
        let makeBooking_URL = "http://localhost:5100/make_booking";
        fetch(makeBooking_URL,
            {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(
                    {
                        
                        "bookingId": bookingId, 
                        "payment_id": paymentId,
                        "paymentStatus": paymentStatus,
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



    let fromFlightInfo = localStorage.getItem("fromFlightInfo").split(",");
    let toFlightInfo = localStorage.getItem("toFlightInfo").split(",");

    console.log(localStorage.getItem("fromFlightInfo").split(","));
    console.log(localStorage.getItem("toFlightInfo").split(","));
    // console.log(fromFlightInfo[4])
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