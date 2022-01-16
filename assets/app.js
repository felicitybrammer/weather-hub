const searchBtnEl = document.getElementById('search-btn');
const currentContainer = document.getElementById('current-container');
const recentsContainer = document.getElementById('recents');
const currentDate = dayjs().format('MMMM D');



if(localStorage.getItem("searchHistory") == null){
    const history =[]; 
    localStorage.setItem("searchHistory", JSON.stringify(history)); 
    //console.log(history);
}

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
                    //console.log(lat,long);
                    $('#city-name').text(location);
                    getWeather(lat,long);
                })
            }    
        });  
};

const apiKey = '556575be6b514b546ca011efc407200d';
// use latitude and longitude values to get current and forecast data
const getWeather = (lat, long) => {
    //get current weather 
    let weatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&exclude=minutely,hourly,daily,alerts&appid=${apiKey}`;
    
    fetch(weatherURL)
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
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
                    
                    $('#date-today').text(currentDate);
                    $('#current-icon').attr('src', currentIcon);
                    $('#current-temp').text(currentTemp);
                    $('#current-wind').text(currentWind);
                    $('#current-hum').text(currentHum);
                    //$('#uv-index').text(uvIndex);
                    
                    if (uvIndex < 3) {
                        //color turn green 
                        $('#uv-index').addClass('bg-green');
                        $('#uv-index').text(`${uvIndex}`);
                        //$('.uvStatusMsg').text(' LOW');
                    } else if (uvIndex <= 6) {
                        // color turns yellow 
                        $('#uv-index').addClass('bg-yellow');
                        $('#uv-index').text(`${uvIndex}`);
                       // $('.uvStatusMsg').text(' MODERATE');
                    } else if (uvIndex <= 8) {
                        // color turns orange 
                        $('#uv-index').addClass('bg-orange');
                        $('#uv-index').text(`${uvIndex}`);
                        //$('.uvStatusMsg').text(' HIGH');
                    } else if (uvIndex < 11) {
                        // color turns red 
                        $('#uv-index').addClass('bg-red');
                        $('#uv-index').text(`${uvIndex}`);
                        //$('.uvStatusMsg').text(' VERY HIGH');
                    } else if (uvIndex >= 11) {
                        // color turns purple 
                        $('#uv-index').addClass('bg-extremePurple');
                        $('#uv-index').text(`${uvIndex}`);
                       // $('.uvStatusMsg').text(' EXTREME');
                    }
                })
            }
        });
    
    
    getForecast(document.getElementById('search-input').value);
};

const getForecast = function (city) {

    

    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    fetch(forecastUrl)
        .then(response =>{
            if (response.ok) {
                response.json().then(data => {
                    for (let i = 1; i < 6; i+=1) {
                    
                    let forecastContainer = document.getElementById('forecast-container');

                    let icon = data.list[i].weather[0].icon;
                    let forecastIcon = `http://openweathermap.org/img/wn/${icon}@2x.png`;
                    let forecastTemp = Math.round(data.list[i].main.temp);
                    let forecastHum = data.list[i].main.humidity; 
                    let forecastWind = Math.round((data.list[i].wind.speed) * 3.6);
                    console.log(forecastTemp,forecastHum,forecastWind, forecastIcon);
                    
                    //display 5 day forecast
                    let forecastCard = $('<div></div>')
                        .addClass('col-2 p-3 text-light card border-dark mb-3 forecast')
                        .attr('data-forecast-id', i);
                    let forecastDate = $('<h4></h4>')
                        .addClass('card-header')
                        .text(dayjs().add(i, 'day').format('MMMM D'));
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
                    }
                })
            }
        });

};


const saveSearch = function(searchTerm) {
    const history = JSON.parse(localStorage.getItem("searchHistory"));
    console.log(history); 
    if (history === null) {
        let tempArr = [];
        let recentSearch = {
            city: searchTerm,
        };
        tempArr.push(recentSearch);
    
        localStorage.setItem('searchHistory', JSON.stringify(tempArr));
    
        loadSearchHistory();
    } else {
        const matching = history.find(({ city }) => city === searchTerm);
        console.log({matching});

        if (matching == undefined) {
            let recentSearch = {
                city: searchTerm,
            };
            history.push(recentSearch);
            console.log({history});
            localStorage.setItem('searchHistory', JSON.stringify(history));
        
            loadSearchHistory();
        } else {
            return;
        }
    }
};

const loadSearchHistory = function() {
    let recentSearches = JSON.parse(localStorage.getItem("searchHistory"));
    console.log(recentSearches);

     $(recentsContainer).empty();

    if (recentSearches === null){
        return;
    } else {
        for (let j = 0; j < recentSearches.length; j++) {

            let recentSearchEl = $('<button></button>')
            .text(recentSearches[j].city)
            .addClass('btn btn-wide btn-block btn-primary rounded p-2 text-white text-center mt-2 searchedCity')
            .attr("data-city", recentSearches[j].city);

            $(recentsContainer).append(recentSearchEl);
        }
    }
};

//event listener on search button
searchBtnEl.addEventListener('click', event => {
    event.preventDefault();
    
    //get value from form input
    let location = document.getElementById('search-input').value;
    if (location === '') {
        return
    } else {
        getCoords(location);
    }
   
    saveSearch(location);
});


$("#recents").on("click", (e) => {
    const result = getCoords($(e.target).text()); 
    console.log(result) //this one returns undefined
})

loadSearchHistory();
