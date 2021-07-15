let map;
let directionsService;

//the route div.
const route = document.getElementById('route');

const markers = [];//used in zooming the map to cover all markers
const paths = [];//used in showing the transport type in the UI when generateVisit.

//the JSON object to be read from server.
let itinerary = {
    id: "",
    title: "",
    love: 0,
    visits: []
};

//https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
class Visit {
    /**
     * 
     * @param {string} id 
     * @param {string} name 
     * @param {number} latitude 
     * @param {number} longitude 
     * @param {string} place_id
     * @param {Date} start_time 
     * @param {Date} end_time 
     * @param {string} memo_title 
     * @param {string} memo_content 
     * @param {Images} memo_images 
     */
    constructor(id, name, latitude, longitude,
        start_time, end_time, place_id, memo_title, memo_content, memo_images) {
        this.id = id;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.start_time = start_time;
        this.end_time = end_time;
        this.place_id = place_id;
        this.memo_title = memo_title;
        this.memo_content = memo_content;
        this.memo_images = memo_images;
    }
}

class Memo_img {
    /**
     * 
     * @param {string} id 
     * @param {string} img_path 
     */
    constructor(id, img_path) {
        this.id = id;
        this.img_path = img_path;
    }
}

function initMap() {
    //create map center at Tokyo.
    const Tokyo = { lat: 35.681375, lng: 139.766390 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: Tokyo
    });

    //init directions service and renderer.
    directionsService = new google.maps.DirectionsService();
}

/**
 * https://developers.google.com/maps/documentation/javascript/examples/map-latlng-literal#maps_map_latlng_literal-javascript
 * https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions
 * @param {google.maps.LatLng | google.maps.LatLngLiteral} latlng example {lat: -34, lng: 151}
 */
function createMarker(latlng) {
    const marker = new google.maps.Marker({
        map: map,
        position: latlng,
        label: "" + visitCounter
    });
    markers.push(marker);
}

function zoomMapToCoverAllMarkers() {
    //Center/Set Zoom of Map to cover all visible Markers?
    //https://stackoverflow.com/questions/19304574/center-set-zoom-of-map-to-cover-all-visible-markers
    const bounds = new google.maps.LatLngBounds();
    for (let i = 0; i < markers.length; i++) {
        bounds.extend(markers[i].getPosition());
    }
    map.fitBounds(bounds);
}

//Convert "(23.34,54.65)" format string to array [23.34,54.65]
//https://stackoverflow.com/questions/26890514/convert-lat-long-string-into-google-maps-api-latlng-object
function getLatLngFromString(location) {
    let latlng = location.replace(/[()]/g, '').split(',');
    //locate = new google.maps.LatLng(parseFloat(latlng[0]) , parseFloat(latlng[1])); return locate; 
    return latlng.map(e => parseFloat(e));
}

/**
 * display the visit details on the UI
 * @param {Visit} visit 
 */
function generateVisit(visit) {
    //if the visit is not the start point.
    if (visitCounter != 1) {
        let newTransit = document.createElement('div');
        newTransit.classList.add("transit");
        newTransit.setAttribute("data-index", "" + visitCounter - 1);
        newTransit.innerHTML = `
            <div class="datetime-interval">
            </div>
            <div class="arrow">
                <i class="fas fa-arrow-down"></i>
            </div>
            <div class="transport">
                `+ (//if google can give us directions or not.
                paths[visitCounter - 2].directionsRenderer ? `
                <i class="fas fa-car"></i>
                driving`:
                    `<i class="fas fa-plane fa-rotate-90"></i>
                flight`) + `
            </div>`;
        route.appendChild(newTransit);
    }

    let newVisit = document.createElement('div');
    newVisit.classList.add("visit");
    newVisit.setAttribute("data-index", "" + visitCounter - 1);
    newVisit.innerHTML = `
        <div class="datetime-interval">
            <div>${dateFns.format(visit.start_time, 'YYYY-MM-DD,HH:mm:ss')}</div>
            `+ (visit.end_time ? `<div>${dateFns.format(visit.end_time, 'YYYY-MM-DD,HH:mm:ss')}</div>` : "") + `
        </div>
        <div class="marker">${visitCounter}</div>
        <div class="place">${visit.place ? visit.place.name : [visit.latitude, visit.longitude]}</div>`;
    route.appendChild(newVisit);

    visitCounter++;
}

function drawNewRoute(i, j, callback) {
    if (itinerary.visits.length < 2) return; //one or no visit, nothing to draw.
    calculateAndDisplayRoute({
        directionsService: directionsService,
        origin: markers[i].getPosition(),
        destination: markers[j].getPosition(),
        //if the visit is start point, use start_time as the departure time.
        departureTime: i == 0 ? itinerary.visits[i].start_time : itinerary.visits[i].end_time
    }, callback);
}

function drawAllRoutes() {
    if (markers.length < 2) return; //one or no visit, nothing to draw.
    //get all visit latitude and longitude.
    for (let i = 0; i < markers.length - 1; i++) {
        calculateAndDisplayRoute({
            directionsService: directionsService,
            origin: markers[i].getPosition(),
            destination: markers[i + 1].getPosition(),
            departureTime: itinerary.visits[i].end_time
        });
    }
}
/**
 * calculate the route using google map directions service and draw the route with Polyline or directionsRenderer on google map.
 * See {@link https://developers.google.com/maps/documentation/javascript/reference/directions#DirectionsRequest google.maps.DirectionsRequest}
 * Also {@link https://stackoverflow.com/questions/16505731/display-a-route-without-directionsrenderer-in-google-map-v3 Display a route without DirectionsRenderer in Google Map V3}
 * {@link https://stackoverflow.com/questions/31342290/es6-classes-default-value ES6 Classes Default Value}
 * @param {google.maps.DirectionsService} directionsService 
 * @param {google.maps.DirectionsRenderer} directionsRenderer 
 * @param {string|LatLng|Place|LatLngLiteral} origin 
 * @param {string|LatLng|Place|LatLngLiteral} destination 
 * @param {google.maps.TravelMode} travelMode, default travel by driving.
 * @param {Date} departureTime the desired time of departure from origin
 * @param {Date} arrivalTime  the desired time of arrival to the destination. If arrival time is specified, departure time is ignored.
 * @param {Function} callback callback to be called after async operation.
 */
//function calculateAndDisplayRoute(directionsService, directionsRenderer, origin, destination, travelMode = google.maps.TravelMode.DRIVING) {
function calculateAndDisplayRoute(
    {
        directionsService = directionsService,
        origin,
        destination,
        travelMode = google.maps.TravelMode.DRIVING,
        departureTime = new Date(),
        arrivalTime
    } = {
            directionsService: directionsService,
            origin,
            destination,
            travelMode: google.maps.TravelMode.DRIVING,
            departureTime: new Date(),
            arrivalTime
        }, callback) {
    directionsService.route(
        {
            origin: origin,
            destination: destination,
            travelMode: travelMode,
            drivingOptions: {
                departureTime: departureTime
            },
            transitOptions: {
                arrivalTime: arrivalTime,
                departureTime: departureTime
            }
        },
        (response, status) => {
            if (status == "OK") {
                const directionsRenderer = new google.maps.DirectionsRenderer({ map: map });
                directionsRenderer.setOptions({
                    markerOptions: { visible: false },
                    //Change zoom after directionsService.route?
                    //https://stackoverflow.com/questions/12641056/change-zoom-after-directionsservice-route
                    preserveViewport: true
                });
                directionsRenderer.setDirections(response);
                paths.push(directionsRenderer);
                if (callback) callback();
            } else {
                //window.alert("Directions request failed due to " + status);
                //console.log("Directions request failed due to " + status);
                createPolyline([origin, destination]);
                if (callback) callback();
            }
        }
    );
}

/**Create polyline with array of latlng.
 * Reference {@link https://letswrite.tw/google-map-api-geometry/ Google Maps API學習筆記-2：在地圖上畫個日本結界}
 * @param {Array<LatLng|LatLngLiteral>} path 
 */
function createPolyline(path) {
    //console.log("createPolyline with path: ", path);
    const polyline = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: "#0000FF",
        strokeOpacity: 0.5,
        strokeWeight: 6
    });
    polyline.setMap(map);
    paths.push(polyline);
}

async function loadItinerary(id) {
    res = await fetch('/itinerary/' + id);
    itinerary = await res.json();
    console.dir(itinerary, { depth: 6 });
}

loadItinerary(3);