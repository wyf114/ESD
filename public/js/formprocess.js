function loadResultsPage() {
    let link = window.location.href
    let firstNum = link.search("html")
    let jsonStr = link.slice(firstNum+6)

    let url = `http://localhost:8080/search/${jsonStr}`
    axios.get(url)
    .then(response => {
        if (response.data.status == "FAILURE") {
            var errorMessage = "We are unable to find recommendations for your search. Please change your search criteria and resubmit the search."
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
                        <h3 class="tm-recommended-title">${ret.legs[0].operatingAirline.code}${ret.legs[0].flightNumber}</h3>
                        <p class="tm-text-highlight">${ret.departureDateTime.slice(10,16)} - ${ret.arrivalDateTime.slice(10,16)}${nextDay}</br>
                        ${ret.originAirportCode} to ${ret.destinationAirportCode}</p>
                        <p class="tm-text-gray">${ret.departureDateTime.slice(0,10)}</br>
                    </div>
                    <a href="./bookingform.html" class="tm-recommended-price-box">
                        <p class="tm-recommended-price">${price}</p>
                        <p class="tm-recommended-price-link">Book</p>
                    </a>
                </div>
                `

                if (returnCount == 10) {
                    break
                }
            }

            for (let seg of items.flights[0].segments) {
                counter++

                var nextDay = ""
                if (seg.departureDateTime.slice(0,10) != seg.arrivalDateTime.slice(0,10)) {
                    nextDay = " (next day)"
                }

                var collapsed = "true"
                if (counter > 1) {
                    collapsed = "false"
                }
                
                pageStr += `
                
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading${counter}">
                    <button class="accordion-button tm-recommended-description-box" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${counter}" aria-expanded="${collapsed}" aria-controls="collapse${counter}">
                        <h3 class="tm-recommended-title">${seg.legs[0].operatingAirline.code}${seg.legs[0].flightNumber}</h3>
                        <p class="tm-text-highlight">${seg.departureDateTime.slice(10,16)} - ${seg.arrivalDateTime.slice(10,16)}${nextDay}</br>
                        ${seg.originAirportCode} to ${seg.destinationAirportCode}</p>
                        <p class="tm-text-gray">${seg.departureDateTime.slice(0,10)}</br>
                        Changi Airport Terminal ${seg.legs[0].departureTerminal}</p>
                    </button>
                    </h2>
                    <div id="collapse${counter}" class="accordion-collapse collapse show" aria-labelledby="heading${counter}" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            ${returnStr}
                        </div>
                    </div>
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




