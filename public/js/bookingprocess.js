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
