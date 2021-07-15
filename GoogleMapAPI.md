# Google Map API
# frontend

## Maps JavaScript API
The main API is [Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/overview)  
[Google Maps API學習筆記-1：地圖、標記、客製樣式](https://letswrite.tw/google-map-api-marker-custom/)  
API除了可以做出客製標記(marker)、info windows外，還可以做一個直接用google map做不到的事，就是客製化地圖樣式。  
這邊直接參考文件的示範，寫一個night mode的地圖，跟隱藏商家的地圖。  
[Google Maps API學習筆記-2：在地圖上畫個日本結界](https://letswrite.tw/google-map-api-geometry/)  
一、畫折線  
```js
let simplePolyline = [
    { lat: 35.7044724, lng: 139.6916473 },
    { lat: 35.7114772, lng: 139.715292 },
    /* ... */
];
let polyline = new google.maps.Polyline({
  path: simplePolyline,
  geodesic: true,
  strokeColor: '#FF0000', // 折線顏色
  strokeOpacity: 1.0, // 折線透明度
  strokeWeight: 5 // 折線粗度
});
polyline.setMap(map);
```  
[Google 地圖 ( 前後端實作 )](https://tutorials.webduino.io/zh-tw/docs/socket/useful/google-map-2.html)  
### Add and delete markers
[Simple Markers](https://developers.google.com/maps/documentation/javascript/examples/marker-simple)  
[Removing Markers](https://developers.google.com/maps/documentation/javascript/examples/marker-remove)  

### Code Samples
https://developers.google.com/maps/documentation/javascript/examples  
### Tutorials
[Google Maps Tutorial -w3schools](https://www.w3schools.com/graphics/google_maps_intro.asp)  
[Google Maps Tutorial -tutorialspoint](https://www.tutorialspoint.com/google_maps/index.htm)  
[Harvard CGA Google Maps Tutorials](https://maps.cga.harvard.edu/gmaps_instruction/exercise01.html)  
### API code playground
Try Google Map API on jsfiddle  
https://jsfiddle.net/user2314737/x4gM4/  
API Playground - Google Maps  
https://codepen.io/sofrlowi/pen/GoKjqp  

## Geocoding API
[What is geocoding?](https://developers.google.com/maps/documentation/geocoding/overview#Geocoding)  
Geocoding is the process of converting addresses (like "1600 Amphitheatre Parkway, Mountain View, CA") into geographic coordinates (like latitude 37.423021 and longitude -122.083739), which you can use to place markers on a map, or position the map.  
Reverse geocoding is the process of converting geographic coordinates into a human-readable address.  
You can also use the Geocoding API to find the address for a given place ID.  

## Places API
The Places API is a service that returns information about places using HTTP requests.  
**[Place IDs](https://developers.google.com/places/web-service/place-id)**  
A place ID is a textual identifier that uniquely identifies a place. The length of the identifier may vary.  
[Google Maps API學習筆記-4：place API自動完成地址、地點評論摘要](https://letswrite.tw/google-map-api-place-api/)  
[Autocomplete for Addresses and Search Terms](https://developers.google.com/maps/documentation/javascript/places-autocomplete)  
右下角的powered by Google是一定會有的，畢竟這是他們家的功能。  
place API回傳資料的部份，還會傳像google map的地點評論，會給到前5則。  
只要是google map有評論資料的，也會回傳。  

### Place Autocomplete
[Place Autocomplete](https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete#all)  

### Nearby Search
[Nearby Search requests](https://developers.google.com/places/web-service/search#PlaceSearchRequests)  
Nearby Search and Text Search return all of the available data fields for the selected place (a subset of the supported fields), and you will be billed accordingly.  

## Distance Matrix Service API
Google's Distance Matrix service computes travel distance and journey duration between multiple origins and destinations using a given mode of travel.  
[Google Maps API學習筆記-5：抓目前位置、計算到各點距離](https://letswrite.tw/google-map-api-distance-matrix/)  
抓使用者目前所在位置，用的是瀏覽器本身的geolocation。  
在使用navigator.geolocation時，有2個步驟：  
1. 確認使用者的裝置支援navigator.geolocation
2. 跟使用者要索取目前位置的權限  

[Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)  
要注意的是，要位置資訊權限的部份，只能在https下執行，如果網址是http就無法。  
### What's the difference between Distance Matrix and Directions API?
Distance Matrix service does not return detailed route information. Route information, including polylines and textual directions, can be obtained by passing the desired single origin and destination to the Directions Service.  

## Directions API
You can calculate directions (using a variety of methods of transportation) by using the **DirectionsService** object.  
You may either handle these directions results yourself or use the **DirectionsRenderer** object to render these results.  
The Directions service can return multi-part directions using a series of waypoints. Directions are displayed as a polyline drawing the route on a map.  
Get the transport details:  
[Transit Details](https://developers.google.com/maps/documentation/javascript/directions#TransitDetails)  
The **TransitDetails** object has:  
**line** contains a TransitLine object literal that contains information about the transit line used in this step.  
The **TransitLine** object has:  
**name** contains the full name of this transit line. eg. "7 Avenue Express" or "14th St Crosstown".  
**vehicle** contains a **Vehicle** object.  
### Waypoints
waypoints[] (optional) specifies an array of DirectionsWaypoints. Waypoints alter a route by routing it through the specified location(s).  
[Using Waypoints in Routes](https://developers.google.com/maps/documentation/javascript/directions#Waypoints)  
Waypoints are not available for transit directions.  
[How to use google map waypoints for TRANSIT](https://stackoverflow.com/questions/22004102/how-to-use-google-map-waypoints-for-transit)  
The only "work-around" is to make multiple independent directions requests, noting that the directions service is subject to a quota and rate limit.  
### Travel Modes
[Travel Modes](https://developers.google.com/maps/documentation/javascript/directions#TravelModes)  
[How to set travel mode to “Flight” in google map direction API .](https://stackoverflow.com/questions/35502261/how-to-set-travel-mode-to-flight-in-google-map-direction-api)  
There is no FLIGHT TravelMode in the Google Maps Javascript API v3.  
One option would be to draw a normal or geodesic Polyline between the two airports.  

## Geometry Library
[Geometry Library](https://developers.google.com/maps/documentation/javascript/geometry)  
[Encoding Methods](https://developers.google.com/maps/documentation/javascript/examples/geometry-encodings)  
[Encoded Polyline Algorithm Format](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)  

# backend
# Official Node.js library
[Node.js Client for Google Maps Services](https://github.com/googlemaps/google-maps-services-js)  
The Node.js Client for Google Maps Services is a Node.js Client library for the following Google Maps APIs:  
- Directions API
- Distance Matrix API
- Elevation API
- Geocoding API
- Places API
- Roads API
- Time Zone API  

install  
```bash
npm install @googlemaps/google-maps-services-js
```  
## sample code download
[js-samples](https://github.com/googlemaps/js-samples)  
```bash
# install the package
npm i -g @googlemaps/js-samples

# extract a sample to a destination folder
googlemaps-js-samples init map-simple destFolder
# example
npx googlemaps-js-samples init directions-simple google-map-js-examples
# run the sample
cd destFolder
npm i
npm run dev
```  
