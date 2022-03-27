function loadResultsPage() {
    let link = window.location.href
    let firstNum = link.search("html")
    let jsonStr = link.slice(firstNum+6)

    let url = `http://localhost:8090/search/${jsonStr}`
    axios.get(url)
    .then(response => {
        var items = response.data.response.flights
        var pageStr = ""
        var counter = 0

        for (let seg of items[0].segments) {
            counter++

            var nextDay = ""
            if (seg.departureDateTime.slice(0,10) != seg.arrivalDateTime.slice(0,10)) {
                nextDay = " (next day)"
            }
            
            pageStr += `
            <div class="search-results">
                <div class="tm-recommended-description-box">
                    <h3 class="tm-recommended-title">${seg.legs[0].operatingAirline.code}${seg.legs[0].flightNumber}</h3>
                    <p class="tm-text-highlight">${seg.departureDateTime.slice(10,16)} - ${seg.arrivalDateTime.slice(10,16)}${nextDay}</br>
                    ${seg.originAirportCode} to ${seg.destinationAirportCode}</p>
                    <p class="tm-text-gray">${seg.departureDateTime.slice(0,10)}</br>
                    Changi Airport Terminal ${seg.legs[0].departureTerminal}</p>
                </div>
                <a href="./bookingform.html" class="tm-recommended-price-box">
                    <p class="tm-recommended-price">$190</p>
                    <p class="tm-recommended-price-link">Book</p>
                </a>
            </div>
            `
            if (counter == 10) {
                break
            }
        }
        document.getElementById("searchResultsHere").innerHTML = pageStr

    }, (error) => {
        console.log(url)
        console.log(error)
    })
}

function sendRequest(jsonStr) {
    window.location = `../booking.html?=${jsonStr}`

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




