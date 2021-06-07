const ipcRenderer = require('electron').ipcRenderer;
//const {BrowserWindow} = require('electron').remote;

const valider = document.querySelector("#valider");
const saisie = document.getElementById("keyword");

var mymap  = L.map('mapid').setView([51.505, -0.09], 13);
var marker = L.marker([51.5, -0.09]).addTo(mymap);

let arg = null;
let city;
let temperature;

let win;
let cityList=null;
let displayedCity=null;
let firstWord=null;

const h3 = document.querySelector("#titre3");

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWFyaWViYSIsImEiOiJja2tuc2RvMmgzNThtMnBxdXg0dWtlNXZmIn0.03wMZswCenHt5EeuNoCpRQ'
}).addTo(mymap); 

keyword.addEventListener('keyup', (event) => {
    //console.log(event.currentTarget.value);
    villes.innerHTML='';
    const url = 'https://places-dsn.algolia.net/1/places/query';

    fetch(url, {
        method: 'POST',
        body: JSON.stringify({query: event.currentTarget.value })
    })
    .then(response => response.json())
    .then((data) => {
        //console.log(data.hits);
        cityList = data.hits;
        displayedCity = [];
        var displedName = "";

        cityList.forEach(ville => {
            const cityName = ville.locale_names.default[0];
            const splittedName = cityName.split(" ", 2);
            firstWord = splittedName[0];
            //console.log(firstWord);

            displedName = firstWord + " (" + ville.country_code + ")";
            
            if (!(displayedCity.includes(displedName))) {
                displayedCity.push(displedName);
                villes.insertAdjacentHTML('beforeend', `<option value="${displedName}">`);
            }
        });

        const options = document.querySelectorAll('#villes option');
        options.forEach(option => {

            keyword.addEventListener('change', (event) => {
                //console.log('click');
                //console.log(keyword.value);
            })
        })     
    })
    .catch((e) => {
        console.log(e);
    })
});

valider.addEventListener('click', ()=> {

    arg = saisie.value;
    var res = arg.split(" ",2);
    city = res[0];

    cityList.forEach(city => {
        //console.log(city);
        //console.log(keyword.value);

        var res = keyword.value.split(" ",2);
        firstWord = res[0];
        console.log(firstWord);
        // console.log(countryCode); 
        console.log(city.locale_names.default[0])
        
        if (city.locale_names.default[0] === firstWord) {
            //console.log(city.locale_names.default[0]);
            const latitude = city._geoloc.lat;
            const longitude = city._geoloc.lng;

            mymap.remove();
            mymap  = L.map('mapid').setView([latitude, longitude], 13);
            marker = L.marker([latitude, longitude]).addTo(mymap);

            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'pk.eyJ1IjoibWFyaWViYSIsImEiOiJja2tuc2RvMmgzNThtMnBxdXg0dWtlNXZmIn0.03wMZswCenHt5EeuNoCpRQ'
            }).addTo(mymap); 
            //findMeteo(latitude, longitude);
        }
    });

    fetchMeteo();
    
});


const fetchMeteo = async() => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a3403e94904b36cf48b8a44f8269d8e4`;
    const response = await fetch(url);
    const weather = await response.json();
    var temp = weather.main.temp;
    //console.log(temp);
    var celsus = temp - 273.15;
    temperature = celsus.toFixed(0);
    h3.innerHTML = "Température : " + temperature  + "°C";
}


/* METEO */
// function findMeteo(lat, lon){
//     var APIkey = 'a3403e94904b36cf48b8a44f8269d8e4';
//     // console.log(lat);
//     // console.log(lon);

//     let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}`;
//     fetch(url)
//     .then(response => response.json()
//     .then((data) => {
//         //console.log(data);
//         //displayGraph(data);
//     }))
//     .catch((error) => {
//         console.log(error);
//     });
// };

function displayGraph(data) {
    var ctx = document.getElementById('myChart').getContext('2d');
    var times = [];
    var temps = [];

    data.list.forEach((e) => {
        var time = e.dt_txt;
        let hour = time.split(' ', 2)

        if (!times.includes(time) && hour[1] === "12:00:00") {
            times.push(time);
            console.log(times);
        }

        var temp = e.main.temp;
        var celsus = temp - 273.15;
        temps.push(celsus);
    });

    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: times,
            datasets: [{
                label: 'Degrés celsus',
                data: temps,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)'
                ],
                borderColor: [],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
};