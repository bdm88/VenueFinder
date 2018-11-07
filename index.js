'use strict'

function watchForm(){
    $('form').submit(event => {
        event.preventDefault();
        let categorySearch = $('select.categories').val();
        let citySearch = $('input.searchCity').val();
        console.log(categorySearch);
        console.log(citySearch);
        getVenues(categorySearch, citySearch);
    })
}

function getVenues(categorySearch, citySearch){
    const searchUrl = 'https://api.foursquare.com/v2/venues/search';
    const parameters = {
        client_id: 'WNYR0IYFESHHSPPUJOXSXUYSALZEH4U1FDRRGHLYA5EUDKE4',
        client_secret: 'HIUDQJCZZJQSBW1ZADOXVXVZL1AYMK4YEH3VCRV3QFCUS1U3',
        near: citySearch,
        intent: 'browse',
        categoryId: categorySearch,
        v: '20181106',
    };
    const queryString = formatParameters(parameters);
    const url = searchUrl + '?' + queryString;

    fetch(url)
        .then(response => {
            if(response.ok){
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => venueDetails(responseJson))
        .catch(err => console.log(err));
}

function formatParameters(parameters){
    const queryItems = Object.keys(parameters)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`)
    return queryItems.join('&');
}

function venueDetails(responseJson){
    console.log(responseJson);
    for(let i = 0; i < responseJson.response.venues.length; i++){
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
    $('.results').append(
        `
        <section class="venues">
        <img class="photoOfVenue" src="${venuePhoto}" alt="Venue Photo">
        <h3 class="resultList">${responseJson.response.venue.name}</h3>
        <p>${responseJson.response.venue.location.address}</p>
        </section>
        `
    )
}

$(function(){
    console.log('App loaded!');
    watchForm();
})

//responseJson.resposne.venue
//name
//location
//discription