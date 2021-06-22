const ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;

const valider = document.querySelector("#valider");
const keyword = document.getElementById("keyword");

var window = remote.getCurrentWindow(); // remote module

let arg = null;
let city;

console.log(keyword);

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
        const cityList = data.hits;
        const displayedCity = [];
        var displedName = "";

        cityList.forEach(ville => {
            const cityName = ville.locale_names.default[0];
            const splittedName = cityName.split(" ", 2);
            const firstWord = splittedName[0];
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

                cityList.forEach(city => {
                    //console.log(city);
                    //console.log(keyword.value);

                    var res = keyword.value.split(" ",2);
                    const firstWord = res[0];
                    // console.log(firstWord);
                    // console.log(countryCode);                    
                });
            })
        })     
        
    })
    .catch((e) => {
        console.log(e);
    })
});

// valider.addEventListener('click', ()=> {
//     //console.log(saisie.value);
//     arg = saisie.value;
//     //ipcRenderer.send("datasFromForm", arg);
//     var res = arg.split(" ",2);
//     city = res[0]
//     fetchMeteo();
//     //window.close();
// });

// const fetchMeteo = async() => {
//     const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a3403e94904b36cf48b8a44f8269d8e4`;
//     const response = await fetch(url);
//     const weather = await response.json();
//     var temp = weather.main.temp;
//     //console.log(temp);
//     var celsus = temp - 273.15;
//     let res = celsus.toFixed(0);
//     //console.log(celsus)
//     ipcRenderer.send("datasFromForm", arg, res);
// }