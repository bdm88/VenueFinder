'use strict'

function formatParameters(parameters){
    const queryItems = Object.keys(parameters)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`)
    return queryItems.join('&');
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
}

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

$(function(){
    console.log('App loaded!');
    watchForm();
})