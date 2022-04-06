function showPayment(){
    var paymentData = JSON.parse(localStorage.getItem("paymentData"))
    // console.log('paymentdata',JSON.stringify(JSON.parse(localStorage.getItem("paymentData"))) )
    console.log((paymentData))
    var paymentId = paymentData.id
    var paymentStatus = paymentData.status
    console.log("paymentId",paymentId)
    var email=localStorage.getItem("email");
    console.log(localStorage.getItem("email"));
    let makeBooking_URL = "http://localhost:5100/make_booking";
    fetch(makeBooking_URL,
        {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(
                {
                    
                    "email": email, 
                    "paymentId": paymentId,
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
}