const ipcRenderer = require('electron').ipcRenderer;

const weatherContainer = document.querySelector('#weather');

var mymap  = L.map('mapid').setView([51.505, -0.09], 13);
var marker = L.marker([51.5, -0.09]).addTo(mymap);

let arg = null;
let ville;
let temperature;
let icon;
let description;

let win;
let cityList = null;
let displayedCity = null;
let firstWord = null;



L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWFyaWViYSIsImEiOiJja2tuc2RvMmgzNThtMnBxdXg0dWtlNXZmIn0.03wMZswCenHt5EeuNoCpRQ'
}).addTo(mymap); 

keyword.addEventListener('keyup', (event) => {
    villes.innerHTML='';
    const url = 'https://places-dsn.algolia.net/1/places/query';

    fetch(url, {
        method: 'POST',
        body: JSON.stringify({query: event.currentTarget.value })
    })
    .then(response => response.json())
    .then((data) => {
        //console.log(data.hits);
        const cityList = data.hits;
        const displayedCity = [];
        var displedName = "";

        cityList.forEach(ville => {
            // console.log(ville._geoloc.lat);
            // console.log(ville._geoloc.lng);
            const cityName = ville.locale_names.default[0];

            const splittedName = cityName.split(" ", 2);
            const firstWord = splittedName[0];
            //console.log(firstWord);

            displedName = firstWord + " (" + ville.country_code + ")";
            
            if (!(displayedCity.includes(displedName))) {
                displayedCity.push(displedName);
                villes.insertAdjacentHTML('beforeend', `<option value="${displedName}">`);
            }

            //villes.insertAdjacentHTML('beforeend', `<option value="${displedName}">`);
            
        });

        const options = document.querySelectorAll('#villes option');
        
        options.forEach(option => {
            keyword.addEventListener('change', (event) => {
                cityList.forEach(city => {
                    var res = keyword.value.split(" ",2);
                    const firstWord = res[0];

                    if (city.locale_names.default[0] === firstWord) {
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

                        // fetchMeteo(firstWord);
                    }

                    fetchMeteo(firstWord);
                });
            })
        })         
    })
    .catch((e) => {
        console.log(e);
    })
});


const fetchMeteo = async(ville) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=a3403e94904b36cf48b8a44f8269d8e4`;
    const response = await fetch(url);
    const weather = await response.json();

    var temp = weather.main.temp;;
    var celsus = temp - 273.15;
    temperature = celsus.toFixed(0);

    icon = weather.weather[0].icon;
    description =  weather.weather[0].description;
    
    weatherContainer.insertAdjacentHTML('beforeend', `
        <h2>${ville}</h2>
        <div class="flex" id="details">
            <p>${temperature}°C</p>
            <img src="http://openweathermap.org/img/wn/${icon}.png" alt"${description}">
        </div>
    `);
    // displayGraph(weather);
}


/* METEO */
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
