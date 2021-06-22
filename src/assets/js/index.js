const { ipcRenderer } = require('electron')
const { BrowserWindow } = require('electron').remote
const path = require('path')

// SELECTORS
const openAlert = document.querySelector('#open-alert');
// const openWindow = document.querySelector('#open-window');
const weatherContainer = document.querySelector('#weather');
const forecastContainer = document.querySelector('#myChart');
// const mapContainer = document.querySelector('#mapid');
const keyword = document.querySelector('input');
const options = document.querySelectorAll('#villes option');
const submitSearch = document.querySelector('#submitSearch');

var mymap  = L.map('mapid').setView([51.505, -0.09], 13);
var marker = L.marker([51.5, -0.09]).addTo(mymap);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWFyaWViYSIsImEiOiJja2tuc2RvMmgzNThtMnBxdXg0dWtlNXZmIn0.03wMZswCenHt5EeuNoCpRQ'
}).addTo(mymap); 

let city;
let description;
let icon;
let name;
var myChart;

// let childWindow = null;


// EVENTS
submitSearch.addEventListener('click', () => {
    city = keyword.value;

    var res = keyword.value.split(" ",2);
    const firstWord = res[0];

    fetchInfos(city, firstWord);
})


// ipcRenderer.on('weather', (event, city, temperature, description, icon) => {
    
//     weatherContainer.insertAdjacentHTML('beforeend', `
//         <h2>${city}</h2>
//         <div class="flex" id="details">
//             <p>${temperature}°C</p>
//             <p>${description}</p>
//             <img src="http://openweathermap.org/img/wn/${icon}.png" alt"${description}">
//         </div>
//     `);

//     childWindow.close();
//     childWindow = undefined;
// })

// FUNCTIONS
const fetchInfos = async(city) => {
    var res = keyword.value.split(" ",2);
    const firstWord = res[0];

    await getMap(city, firstWord);
    fetchMeteo(city);
}

// TODO : Autocomplete

// Meteo
const fetchMeteo = async(city) => {
    weatherContainer.innerHTML='';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ddfed569c0b0f2652ee7810c08c5f405`;
    const response = await fetch(url);
    const data = await response.json();
    const temperature = Math.round(data.main.temp - 273.15);

    let icon = data.weather[0].icon;
    let description =  data.weather[0].description;
    
    let cityMaj = strUcFirst(city);

    weatherContainer.insertAdjacentHTML('afterbegin', `
        <h2>${cityMaj}</h2>
        <div id="details">
            <p>${temperature}°C</p>
            <img src="http://openweathermap.org/img/wn/${icon}.png" alt"${description}">
        </div>
    `);

    // Appel prévisions
    displayGraph(city);
}

function strUcFirst(a){return (a+'').charAt(0).toUpperCase()+a.substr(1);}

// Previsions
const displayGraph = async(city) => {
    forecastContainer.innerHTML = "";
    
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=ddfed569c0b0f2652ee7810c08c5f405`;
    const response = await fetch(url);
    const data = await response.json();

    var ctx = document.getElementById('myChart').getContext('2d');
    var times = [];
    var temperatures = [];

    // var increment;

    data.list.forEach((item) => {
        var time = item.dt_txt;
        let hour = time.split(' ', 2)

        if (!times.includes(time) && hour[1] === "12:00:00") {
            times.push(time);
        }
        var temperature = item.main.temp;
        var celsus = temperature - 273.15;
        temperatures.push(celsus);
    });

    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: times,
            datasets: [{
                label: 'Temperatures',
                data: temperatures,
                backgroundColor: [
                    'rgba(255, 99, 132, 0)',
                ],
                borderColor: [
                    'rgba(0, 0, 0, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Les prévisions sur 5 jours',
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                }
            },
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

// Map
const getMap = async(city, firstWord) => {

    villes.innerHTML='';

    // Villes
    const url = 'https://places-dsn.algolia.net/1/places/query';
    const response = await fetch(url);
    const data = await response.json();

    const cityList = data.hits;
    
    // Pour chaque ville, on récupère le nom
    for(city of cityList){
        //console.log(firstWord.toLowerCase());
        //console.log(city.locale_names.default[0]);

        if (city.locale_names.default[0].toLowerCase() === firstWord.toLowerCase()) {
            
            const latitude = city._geoloc.lat;
            const longitude = city._geoloc.lng;

            // Carte
            if( mymap != undefined){
                mymap.remove();
            }

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
        }
    }
}