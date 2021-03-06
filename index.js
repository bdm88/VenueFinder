'use strict'

function watchForm(){
    $('form').submit(event => {
        event.preventDefault();
        let categorySearch = $('select.categories').val();
        let citySearch = $('input.searchCity').val();
        $('.weatherResults').remove();
        $('.venueResults').remove();
        getVenues(categorySearch, citySearch);
        getWeather(citySearch);
    })
}

function getWeather(citySearch){
    const searchWeatherUrl = 'http://api.openweathermap.org/data/2.5/forecast';
    let cityWeatherSearch = citySearch + ',us';
    const weatherParameters = {
        q: cityWeatherSearch,
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
    for(let i = 0; i < responseJson.list.length; i = i + 3){
        let dateTime = `${responseJson.list[i].dt_txt}`.split(" ");
        let date = dateTime[0];
        let time = dateTime[1];
        let temp = `${responseJson.list[i].main.temp}`.split(".")[0];
        let wind = `${responseJson.list[i].wind.speed}`.split(".")[0];
        $('.weatherResultsContainer').append(
            `
            <section role="region" class="weatherResults">
                <p class="weather"><span class="weatherTitles">Date:</span> ${date}</p>
                <p class="weather"><span class="weatherTitles">Time:</span> ${time}</p>
                <img class="weather wDescription" src="http://openweathermap.org/img/w/${responseJson.list[i].weather[0].icon}.png" alt=">${responseJson.list[i].weather[0].description}">
                <p class="wDescription">${responseJson.list[i].weather[0].description}</p>
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
        .catch(err => alert('City not found.'));
}

function formatVenueParameters(venueParameters){
    const queryItems = Object.keys(venueParameters)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(venueParameters[key])}`)
    return queryItems.join('&');
}

function venueDetails(responseJson){
    console.log(responseJson);
//    for(let i = 0; i < responseJson.response.venues.length; i++){
    for(let i = 0; i < 10; i++){
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
            .catch(err => alert('Try again later.'));
    };
}

function displayVenues(responseJson){
    console.log(responseJson);
    let venuePhoto = `${responseJson.response.venue.bestPhoto.prefix}` + `cap300` + `${responseJson.response.venue.bestPhoto.suffix}`;
    let venueAddress = `${responseJson.response.venue.location.formattedAddress[0]}, ${responseJson.response.venue.location.formattedAddress[1]}`
    if(responseJson.response.venue.description == null){
        $('.venueResultsContainer').append(
            `
            <section role="region" class="venueResults">
                <img class="photoOfVenue" src="${venuePhoto}" alt="Venue Photo">
                <h3 class="venueName">${responseJson.response.venue.name}</h3><br>
                <p class="venueCat">${responseJson.response.venue.categories[0].name}</p><br>
                <button type="button" class="popupToggle">Venue Information</button>
                <section role="region" class="venuePopup">
                    <p class="venuePopupText">
                        <span class="addressTitle">Address:</span><br>
                        ${responseJson.response.venue.location.formattedAddress}
                    </p>
                </section>
            </section>
            `
        )
    }
    else {
        $('.venueResultsContainer').append(
            `
            <section role="region" class="venueResults">
                <img class="photoOfVenue" src="${venuePhoto}" alt="Venue Photo">
                <h3 class="venueName">${responseJson.response.venue.name}</h3><br>
                <p class="venueCat">${responseJson.response.venue.categories[0].name}</p><br>
                <button type="button" class="popupToggle">Venue Information</button>
                <section role="region" class="venuePopup">
                    <p class="venuePopupText">${responseJson.response.venue.description}<br>
                        <span class="addressTitle">Address:</span><br>
                        ${venueAddress}
                    </p>
                </section>
            </section>
            `
        )
    }
}

function popupInfo(){
    $('.venueResultsContainer').on('click', '.popupToggle', function(){
        $(this).parent().find('.venuePopup').toggleClass('show');
    })
}

$(function(){
    watchForm();
    popupInfo();
})