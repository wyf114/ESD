function showPayment(){
    console.log(localStorage.getItem("paymentInfo"));
    let paymentInfo = localStorage.getItem("paymentInfo").split(",");
    document.getElementById("price").innerHTML = paymentInfo[0];
    document.getElementById("email").innerHTML = paymentInfo[1];
    var email=document.getElementById("email").innerHTML;
    console.log(document.getElementById("email"));
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