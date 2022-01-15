const searchBtnEl = document.getElementById('search-btn');
const currentContainer = document.getElementById('current-container');
const recentsContainer = document.getElementById('recents');
const currentDate = dayjs().format('M-DD-YYYY');
let searches = [];

//get the latitude and longitude of the search value
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

                getWeather(lat,long);
                
                $('#city-name').text(location);
            })
        }    
    });  
}


// use latitude and longitude values to get current and forecast data
const getWeather = (lat, long) => {
    
    //get current weather
    const apiKey = '556575be6b514b546ca011efc407200d';    
    let weatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&exclude=minutely,hourly,daily,alerts&appid=${apiKey}`;
    
    fetch(weatherURL)
    .then(response => {
        if (response.ok) {
            response.json().then(data => {

                //also get icon
                let cIcon = data.current.weather[0].icon;
                let currentIcon = `http://openweathermap.org/img/wn/${cIcon}@2x.png`;
                //display: round up add C units
                let currentTemp = Math.round(data.current.temp);
                //display: %
                let currentHum = data.current.humidity;
                let uvIndex = data.current.uvi;
                //display: change from m/s to km/h  (* 3.6)
                let currentWind = Math.round((data.current.wind_speed) *3.6);
                console.log(currentTemp,currentHum,uvIndex,currentWind, currentIcon);


                //Display Current Day Info
                //date
                
                $('#current-icon').attr('src', currentIcon);
                $('#current-temp').text(currentTemp);
                $('#current-wind').text(currentWind);
                $('#current-hum').text(currentHum);
                $('#uv-index').text(uvIndex);


            })
        }
    });

    let city = document.getElementById('search-input').value;
    localStorage.setItem('lastSearch', city); //works!
    console.log(city);

    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    fetch(forecastUrl)
    .then(response =>{
        if (response.ok) {
            response.json().then(data => {
                //console.log(data.list);
                //console.log(data.list.length);
                for (let i = 4; i < data.list.length; i+=8) {
                
                    //put in a nested for loop here? to get the dates right?

                //icons url  http://openweathermap.org/img/wn/${icon}@2x.png
                //icon data.list[i].weather[0].icon
                let forecastContainer = document.getElementById('forecast-container');

                let icon = data.list[i].weather[0].icon;
                let forecastIcon = `http://openweathermap.org/img/wn/${icon}@2x.png`;
                let forecastTemp = Math.round(data.list[i].main.temp);
                let forecastHum = data.list[i].main.humidity; 
                let forecastWind = Math.round((data.list[i].wind.speed) * 3.6);
                console.log(forecastTemp,forecastHum,forecastWind, forecastIcon);
                
                //display 5 day forecast
                let forecastCard = $('<div></div>')
                    .addClass('card border-dark mb-3 forecast')
                    .attr('data-forecast-id', i);
                let forecastDate = $('<h4></h4>')
                    .addClass('card-header')
                    .text(dayjs().add(i, 'day').format('M-DD-YYYY'));
                let forecastImg = $("<img>")
                    // .addClass('card-title')
                    .attr('src', forecastIcon)
                    .attr('alt', '');
                let temp = $('<div></div>')
                    .text('Temp: ' + forecastTemp + ' °C');
                let wind = $('<div></div>')
                    .text('Wind: ' + forecastWind + ' km/h');
                let humidity = $('<div></div>')
                    .text('Humidity: ' + forecastHum + ' %');

                
                $(forecastCard).append(forecastDate, forecastImg, temp, wind, humidity);
                $(forecastContainer).append(forecastCard);
                

                //date
                //icon
                //temp
                // $('.forecast-temp' + i).text(forecastTemp);
                // //wind
                // $('.forecast-wind1' + i).text(forecastWind);
                // //humidity
                // $('.forecast-hum1' + i).text(forecastHum);

                }
            })
        }
    });

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
    if (location === '') {
        return
    } else {
        getCoords(location);
    }
    //clear the form
   // document.getElementById('search-input') = '';
});


var saveSearch = function(searchTerm) {
    searchHistory = JSON.parse(localStorage.getItem("searches"));
    
    if (searchHistory === null) {
        var tempArr = [];
        var recentSearch = {
            city: searchTerm,
        };
        tempArr.push(recentSearch);
    
        localStorage.setItem('searchHistory', JSON.stringify(tempArr));
    
        loadSearchHistory();
    } else {
        var matching = searchHistory.find(({ city }) => city === searchTerm);
        console.log(matching);

        if (matching === undefined) {
            var recentSearch = {
                city: searchTerm,
            };
            searchHistory.push(recentSearch);
        
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        
            loadSearchHistory();
        } else {
            return;
        }
    }
};

var loadSearchHistory = function() {
    var recentSearches = JSON.parse(localStorage.getItem('searches'));
    console.log(recentSearches);

    $(recentsContainer).empty();

    if (recentSearches === null){
        return;
    } else {
        for (j = 0; j < recentSearches.length; j ++) {
            var recentSearchEl = $('<a></a>')
            .text(recentSearches[j].city)
            .addClass('rounded p-2 searchestext-white text-center mt-2');
    
            $(recentsContainer).append(recentSearchEl);
        }
    }
};

loadSearchHistory();
