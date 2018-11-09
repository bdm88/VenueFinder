'use strict'

function watchForm(){
    $('form').submit(event => {
        event.preventDefault();
        let categorySearch = $('select.categories').val();
        let citySearch = $('input.searchCity').val();
        console.log(categorySearch);
        console.log(citySearch);
        getVenues(categorySearch, citySearch);
        getWeather(citySearch);
    })
}

function getWeather(citySearch){
    const searchWeatherUrl = 'http://api.openweathermap.org/data/2.5/forecast';
    const weatherParameters = {
        q: citySearch,
        units: 'imperial',
        APPID: '17b66e4018e261339e11f79fbf4cdce2',
    };
    const weatherQueryString = formatWeatherParameters(weatherParameters);
    const weatherUrl = searchWeatherUrl + '?' + weatherQueryString;

    fetch(weatherUrl)
        .then(response => {
            if(response.ok){
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayWeather(responseJson))
        .catch(err => console.log(err));
}

function formatWeatherParameters(weatherParameters){
    const queryItems = Object.keys(weatherParameters)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(weatherParameters[key])}`)
    return queryItems.join('&');
}

function displayWeather(responseJson){
    console.log(responseJson);
    for(let i = 0; i < 10; i++){
        let dateTime = `${responseJson.list[i].dt_txt}`.split(" ");
        let date = dateTime[0];
        let time = dateTime[1];
        let temp = `${responseJson.list[i].main.temp}`.split(".")[0];
        let wind = `${responseJson.list[i].wind.speed}`.split(".")[0];
        $('.weatherResultsContainer').append(
            `
            <section class="weatherResults">
                <p class="weather"><span class="weatherTitles">Date:</span> ${date}</p>
                <p class="weather">${time}</p>
                <p class="weather">${responseJson.list[i].weather[0].description}</p>
                <p class="weather"><span class="weatherTitles">Temp:</span> ${temp}°F</p>
                <p class="weather"><span class="weatherTitles">Humidity:</span> ${responseJson.list[i].main.humidity}%</p>
                <p class="weather"><span class="weatherTitles">Wind:</span> ${wind} mph</p>
            </section>
            `
        )
    }
}

function getVenues(categorySearch, citySearch){
    const searchVenueUrl = 'https://api.foursquare.com/v2/venues/search';
    const venueParameters = {
        client_id: 'WNYR0IYFESHHSPPUJOXSXUYSALZEH4U1FDRRGHLYA5EUDKE4',
        client_secret: 'HIUDQJCZZJQSBW1ZADOXVXVZL1AYMK4YEH3VCRV3QFCUS1U3',
        near: citySearch,
        intent: 'browse',
        categoryId: categorySearch,
        v: '20181106',
    };
    const venueQueryString = formatVenueParameters(venueParameters);
    const venueUrl = searchVenueUrl + '?' + venueQueryString;

    fetch(venueUrl)
        .then(response => {
            if(response.ok){
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => venueDetails(responseJson))
        .catch(err => console.log(err));
}

function formatVenueParameters(venueParameters){
    const queryItems = Object.keys(venueParameters)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(venueParameters[key])}`)
    return queryItems.join('&');
}

function venueDetails(responseJson){
    console.log(responseJson);
//    for(let i = 0; i < responseJson.response.venues.length; i++){
    for(let i = 0; i < 1; i++){
        const venueDetailsRequest = 'https://api.foursquare.com/v2/venues/';
        const venueId = responseJson.response.venues[i].id;
        const detailsAuth = 'client_id=WNYR0IYFESHHSPPUJOXSXUYSALZEH4U1FDRRGHLYA5EUDKE4&client_secret=HIUDQJCZZJQSBW1ZADOXVXVZL1AYMK4YEH3VCRV3QFCUS1U3&v=20181106';
        const venueDetailsUrl = venueDetailsRequest + venueId + '?' + detailsAuth;
        console.log(venueDetailsUrl)

        fetch(venueDetailsUrl)
            .then(response => {
                if(response.ok){
                    return response.json();
                }
                throw new Error(response.statusText);
            })
            .then(responseJson => displayVenues(responseJson))
            .catch(err => console.log(err));
    };
}

function displayVenues(responseJson){
    console.log(responseJson);
    let venuePhoto = `${responseJson.response.venue.bestPhoto.prefix}` + `cap100` + `${responseJson.response.venue.bestPhoto.suffix}`;
    $('.venueResultsContainer').append(
        `
        <section class="venueResults">
            <img class="photoOfVenue" src="${venuePhoto}" alt="Venue Photo">
            <h3 class="venueName">${responseJson.response.venue.name}</h3>
            <button type="button" class="popupToggle">Venue Information</button>
            <section class="venuePopup">
                <p>${responseJson.response.venue.description}</p>
            </section>
        </section>
        `
    )
}

function popupInfo(){
    console.log('functioncalled');
    $('.venueResultsContainer').on('click', '.popupToggle', function(){
        console.log('buttonclicked');
        $('.venuePopup').toggleClass('show');
    })
}

$(function(){
    console.log('App loaded!');
    watchForm();
    popupInfo();
})