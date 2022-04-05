function loadResultsPage() {
    let bodyTxt=document.getElementById("bodyTxt")
    bodyTxt.innerHTML="Please wait we are searching the flight for you......"
    setTimeout(() => { bodyTxt.innerHTML = "" }, 2000);
    let link = window.location.href
    let firstNum = link.search("html")
    let jsonStr = link.slice(firstNum+6)

    let url = `http://localhost:8080/search/${jsonStr}`
    axios.get(url)
    .then(response => {
        if (response.data.status == "FAILURE") {
            var errorMessage = response.data.message
            document.getElementById("searchResultsHere").innerHTML = errorMessage
        }
        else {
            var items = response.data.response
            var pageStr = ""
            var counter = 0
            var returnStr = ""
            var returnCount = 0
            var price = items.recommendations[0].fareSummary.fareTotal.totalAmount

            for (let ret of items.flights[1].segments) {
                returnCount++

                var nextDay = ""
                if (ret.departureDateTime.slice(0,10) != ret.arrivalDateTime.slice(0,10)) {
                    nextDay = " (next day)"
                }

                returnStr += `
                <div class="search-results">
                    <div class="tm-recommended-description-box">
                        <h3 class="tm-recommended-title" id="flightNumber${returnCount}">${ret.legs[0].operatingAirline.code}${ret.legs[0].flightNumber}</h3>
                        <p class="tm-text-highlight"><span id="departTime${returnCount}">${ret.departureDateTime.slice(11,16)}</span> -<span id="arriveTime${returnCount}">${ret.arrivalDateTime.slice(11,16)}${nextDay}</span></br>
                        <span id="originCode${returnCount}">${ret.originAirportCode}</span> to <span id="desCode${returnCount}">${ret.destinationAirportCode}</span></p>
                        <p class="tm-text-gray" id="departDate${returnCount}">${ret.departureDateTime.slice(0,10)}</p></br>
                    </div>
                    <a href="./bookingform.html" class="tm-recommended-price-box" onclick="bookReturnFlight(${returnCount})">
                        <p class="tm-recommended-price" id="price${returnCount}">${price}</p>
                        <p class="tm-recommended-price-link" id="book${returnCount}">Book</p>
                    </a>
                </div>
                `

                if (returnCount == 10) {
                    break
                }
            }

            localStorage.setItem("returnStr", returnStr)

            for (let seg of items.flights[0].segments) {
                counter++

                var nextDay = ""
                if (seg.departureDateTime.slice(0,10) != seg.arrivalDateTime.slice(0,10)) {
                    nextDay = " (next day)"
                }
                
                pageStr += `
                
                <div class="search-results">
                    <div class="tm-recommended-description-box">
                        <h3 class="tm-recommended-title" id="toFlightNumber${counter}">${seg.legs[0].operatingAirline.code}${seg.legs[0].flightNumber}</h3>
                        <p class="tm-text-highlight"><span id="toDepartTime${counter}">${seg.departureDateTime.slice(10,16)}</span> - <span id="toArriveTime${counter}">${seg.arrivalDateTime.slice(10,16)}${nextDay}</span></br>
                        <span id="toOriginCode${counter}">${seg.originAirportCode}</span> to <span id="toDesCode${counter}">${seg.destinationAirportCode}</span></p>
                        <p class="tm-text-gray"><span id="toDepartDate${counter}">${seg.departureDateTime.slice(0,10)}</span></br>
                        Changi Airport Terminal ${seg.legs[0].departureTerminal}</p>
                    </div>
                        <a href="./bookreturnflight.html" class="tm-recommended-price-box" onclick="bookFlight(${counter})">
                            <p class="tm-recommended-price-link">Choose Return Flights</p>
                        </a>
                </div>`

                if (counter == 10) {
                    break
                }
            }
            document.getElementById("searchResultsHere").innerHTML = pageStr
        }
    }, (error) => {
        console.log(url)
        console.log(error)
    })
}

function loadReturnFlights() {
    document.getElementById("returnResultsHere").innerHTML = localStorage.getItem("returnStr")

}

function sendRequest(jsonStr) {
    window.location = `../../public/booking.html?=${jsonStr}`

}

function processForm() {
    let origin = document.getElementById('inputOrigin').value
    let dest = document.getElementById('inputDest').value
    let departDate = document.getElementById('inputDeparture').value
    let returnDate = document.getElementById('inputReturn').value
    let numAdult = document.getElementById('inputAdult').value
    let numChild = document.getElementById('inputChildren').value
    let seatClass = document.getElementById('inputClass').value

    let clientUUIDKey = "\"clientUUID\":"
    let clientUUIDValue = "\"05b2fa78-a0f8-4357-97fe-d18506618c3f\","
    let requestKey = "\"request\":"

    let itineraryKey = "{\"itineraryDetails\":"
    let itineraryValue = "[{\"originAirportCode\":\"" + origin + "\",\"destinationAirportCode\":\"" + dest + "\",\"departureDate\":\"" + departDate + "\",\"returnDate\":\"" + returnDate + "\"}],\"cabinClass\":\"" + seatClass + "\",\"adultCount\":" + numAdult + ",\"childCount\":" + numChild + ",\"infantCount\":0}"

    let requestValue = itineraryKey + itineraryValue
    
    let jsonStr = "{" + clientUUIDKey + clientUUIDValue + requestKey + requestValue + "}"

    console.log(jsonStr)
    let cleanStr = encodeURIComponent(jsonStr)
    sendRequest(cleanStr)
}




