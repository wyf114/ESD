function bookReturnFlight(returnCount){

      let fromFlightNumber = document.getElementById(`flightNumber${returnCount}`).textContent;
      let fromDepartTime = document.getElementById(`departTime${returnCount}`).textContent;
      let fromArriveTime = document.getElementById(`arriveTime${returnCount}`).textContent;
      let fromOriginCode = document.getElementById(`originCode${returnCount}`).textContent;
      let fromDesCode = document.getElementById(`desCode${returnCount}`).textContent;
      let fromDepartDate =document.getElementById(`departDate${returnCount}`).textContent;
      let price= document.getElementById(`price${returnCount}`).textContent;

      var fromFlightInfo = [fromFlightNumber, fromDepartTime, fromArriveTime, fromOriginCode, fromDesCode, fromDepartDate, price];

      localStorage.setItem("fromFlightInfo", fromFlightInfo);

    }

function bookFlight(counter){

  let toFlightNumber = document.getElementById(`toFlightNumber${counter}`).textContent;
  let toDepartTime = document.getElementById(`toDepartTime${counter}`).textContent;
  let toArriveTime = document.getElementById(`toArriveTime${counter}`).textContent;
  let toOriginCode = document.getElementById(`toOriginCode${counter}`).textContent;
  let toDesCode = document.getElementById(`toDesCode${counter}`).textContent;
  let toDepartDate =document.getElementById(`toDepartDate${counter}`).textContent;

  var toFlightInfo = [toFlightNumber, toDepartTime, toArriveTime, toOriginCode, toDesCode, toDepartDate];

  localStorage.setItem("toFlightInfo", toFlightInfo);

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

