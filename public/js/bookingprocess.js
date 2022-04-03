function bookFlight(){
      // use the same name
      let flightNumber = document.getElementById("flightNumber").textContent;
      let departTime = document.getElementById("departTime").textContent;
      let arriveTime = document.getElementById("arriveTime").textContent;
      let originCode = document.getElementById("originCode").textContent;
      let desCode = document.getElementById("desCode").textContent;
      let departDate =document.getElementById("departDate").textContent;
      let price= document.getElementById("price").textContent;
      //don't change below part
      var flightInfo = [flightNumber,departTime,arriveTime,originCode,desCode,departDate,price];
      console.log(flightInfo);
      console.log(JSON.stringify(flightInfo));
      localStorage.setItem("flightInfo", flightInfo);
    }

// function confirmBooking(){
//     let flightNumber = document.getElementById("flightNumber").textContent;
//     let departTime = document.getElementById("departTime").textContent;
//     let arriveTime = document.getElementById("arriveTime").textContent;
//     let originCode = document.getElementById("originCode").textContent;
//     let desCode = document.getElementById("desCode").textContent;
//     let departDate =document.getElementById("departDate").textContent;
//     let price= document.getElementById("price").textContent;
//     let makeBooking_URL = "http://localhost:5100/make_booking";
//     console.log(flightNumber);
//     fetch(makeBooking_URL,
//         {
//             method: "POST",
//             headers: {
//                 "Content-type": "application/json"
//             },
//             body: JSON.stringify(
//                 {
//                     "flightNumber": flightNumber,
//                     "departTime":departTime,
//                     "arriveTime":arriveTime,
//                     "originCode":originCode,
//                     "desCode":desCode,
//                     "departDate":departDate,
//                     "price":price,
//                 })
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//             result = data.data;
//             console.log(result);
           
//         })
//         .catch(error => {
//             console.log("Problem in making a booking. " + error);
//         })
// }

