
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'world-airports-directory.p.rapidapi.com',
    'X-RapidAPI-Key': '5167aa7200msh4b06b4ce708bbb7p1e8bf1jsnf779864a3bfc'
  }
};


function showAirport1() {
  var userInput1 = document.getElementById("inputOrigin").value;
  var matchList1 = document.getElementById('match-list1');
  matchList1.style.display='block';
  console.log(userInput1);
  fetch('https://world-airports-directory.p.rapidapi.com/v1/airports/' + userInput1 + '?page=1&limit=5&sortBy=AirportName%3Aasc', options)
    .then(async response => {
      try {
        const data = await response.json();
        console.log(data.results)
        var matches = data.results;

        if (userInput1.length === 0) {
          matches = [];
        };
        if (matches.length > 0) {
          var html = matches.map(match => `<div class="card eachMatch"><p>${match.AirportName} (${match.city})<span class ="text-primary">${match.AirportCode}</span></p></div>`).join('');
          matchList1.innerHTML = html;
          var allList = matchList1.querySelectorAll(".card");
          for (let i = 0; i < allList.length; i++) {
            //adding onclick attribute in all li tag
            allList[i].setAttribute("onclick", "select1(this)");
          }
          console.log(html);

        }

      } catch (err) {
        return console.error(err);
      }


    })
}
function showAirport2() {
  var userInput2 = document.getElementById("inputDest").value;
  var matchList2 = document.getElementById('match-list2');
  matchList2.style.display='block';
  console.log(userInput2);
  fetch('https://world-airports-directory.p.rapidapi.com/v1/airports/' + userInput2 + '?page=1&limit=5&sortBy=AirportName%3Aasc', options)
    .then(async response => {
      try {
        const data = await response.json();
        console.log(data.results)
        var matches = data.results;

        if (userInput2.length === 0) {
          matches = [];
        };
        if (matches.length > 0) {
          var html = matches.map(match => `<div class="card eachMatch"><p>${match.AirportName} (${match.city})<span class ="text-primary">${match.AirportCode}</span></p></div>`).join('');
          matchList2.innerHTML = html;
          var allList = matchList2.querySelectorAll(".card");
          for (let i = 0; i < allList.length; i++) {
            //adding onclick attribute in all li tag
            allList[i].setAttribute("onclick", "select2(this)");
          }
          console.log(html);

        }

      } catch (err) {
        return console.error(err);
      }


    })
}
function select1(element) {
  var userInputBox1 = document.querySelector("#inputOrigin");;
  console.log(element.getElementsByTagName('span')[0].textContent);
  let selectData = element.getElementsByTagName('span')[0].textContent;
  userInputBox1.value = selectData;
  var matchList1 = document.getElementById('match-list1');
  matchList1.style.display='none';
}
function select2(element) {
  var userInputBox2 = document.querySelector("#inputDest");;
  console.log(element.getElementsByTagName('span')[0].textContent);
  let selectData = element.getElementsByTagName('span')[0].textContent;
  userInputBox2.value = selectData;
  var matchList2 = document.getElementById('match-list2');
  matchList2.style.display='none';
}
