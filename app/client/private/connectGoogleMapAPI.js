//How do I load google maps external javascript after page loads?
//https://stackoverflow.com/questions/23354358/how-do-i-load-google-maps-external-javascript-after-page-loads
//Add defer or async attribute to dynamically generated script tags via JavaScript
//https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap
window.onload = connectGoogleAPI;

function connectGoogleAPI() {
    const GOOGLE_MAPS_API_KEY="your google map api key";
    const script = document.createElement('script');
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCPJpjD-qcR_yIxJnS8maR5W9KB0E3EzYI&callback=initMap&libraries=places`;
    document.body.appendChild(script);
}