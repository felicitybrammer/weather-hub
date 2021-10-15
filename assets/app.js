let searchBtnEl = document.getElementById('search-btn');



const getCoords = location => {
    const apiKey = '556575be6b514b546ca011efc407200d';
    //get latitude and longitude data for city in search field
    let latLongUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;

    fetch(latLongUrl)
    .then (response => {
        if (response.ok) {
            response.json().then(data => {
                let lat = data.coord.lat;
                let long = data.coord.lon; 
                console.log(lat,long);

                //localStorage.setItem('lastLocation', location);

                getWeather(lat,long);

            })
        }    
    });

    
}


const getWeather = (lat, long) => {

    const apiKey = '556575be6b514b546ca011efc407200d';    
    let weatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&exclude=minutely,hourly,alerts&appid=${apiKey}`;
    //current weather
    fetch(weatherURL)
    .then(response => {
        if (response.ok) {
            response.json().then(data => {
                //display: round up add C units
                let currentTemp = Math.round(data.current.temp);
                //display: %
                let currentHum = data.current.humidity;
                let uvIndex = data.current.uvi;
                //display: change from m/s to km/h  (* 3.6)
                let currentWind = Math.round((data.current.wind_speed) *3.6);
                console.log(currentTemp,currentHum,uvIndex,currentWind);


            })
        }
    });

    //let forecastUrl = `api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`

    /*fetch(forecastUrl)
    .then(response =>{
        if (response.ok) {
            response.json().then(data => {
                let forecastTemp = Math.round(data.list.main.temp);
                let forecastHum = data.list.main.humidity;
                let forecastWind = Math.round((data.list.wind.speed) * 3.6);
                console.log(forecastTemp,forecastHum,forecastWind);
            })
        }
    });*/

};

//event listener on search button
searchBtnEl.addEventListener('click', event => {
    event.preventDefault();
    console.log('button clicked!');
    //get value from form input
    let location = document.getElementById('search-input').value;
    console.log(location);
    // use location to get weather data (getCoords(city))
    // function to get data
    getCoords(location);
    //clear the form
   // document.getElementById('search-input') = '';
});
