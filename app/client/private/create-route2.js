//bug in deleteVisitAt(), redraw path will push the path to the end of paths.
//And later deletion of path will be affected.

let map;
let directionsService;
//let directionsRenderer;

//------------map overlaps-----------
//store all the markers on the map, which allow the user to delete markers later on.
//markers.length should equal visitCounter
let markers = [];
//store all the directionsRenderer and polyline when drawing the path so as to delete later on.
let paths = [];
class Path {
    constructor(directionsRenderer = null, polyline = null) {
        this.directionsRenderer = directionsRenderer;
        this.polyline = polyline;
    }
    removeFromMap() {
        if (this.directionsRenderer) {
            this.directionsRenderer.setMap(null);
        }
        if (this.polyline) {
            this.polyline.setMap(null);
        }
    }
}

//the route div.
const route = document.getElementById('route');
//count the visit generated
let visitCounter = 1;

//the JSON object that need to be passed to server.
const itinerary = {
    title: "",
    visits: []
};

class Visit {
    constructor(name = "", latitude = 0, longitude = 0, place = null, start_time, end_time) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.place = place;
        this.start_time = start_time;
        this.end_time = end_time;
    }
}

//ES6 Classes Default Value
//https://stackoverflow.com/questions/31342290/es6-classes-default-value
class Place {
    constructor({ name = "", address = "", description = "", google_place_id = "" } = { name: "", address: "", description: "", google_place_id: "" }) {
        this.name = name;
        this.address = address;
        this.description = description;
        this.google_place_id = google_place_id;
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
    //directionsRenderer = new google.maps.DirectionsRenderer({ map: map });

    //------user can locate a place by place autocomplete search or clicking on the map.------
    //get the place details by selecting the place from search box drop down result.
    getPlaceDetailsByAutocomplete();
    //user click on the map to get the place details.
    map.addListener('click', getPlaceDetailsByClick);
}

function getPlaceDetailsByAutocomplete() {
    //init the place autocomplete search box and bind it to the map.
    const input = document.getElementById("place-input");
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map);

    //get the place details by selecting the place from search box drop down result.
    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        //console.log("autocomplete place: ", place);

        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert(
                "No details available for input: '" + place.name + "'"
            );
            return;
        }

        // If the place has a geometry, then present it on a map.
        /* if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17); // Why 17? Because it looks good.
        } */

        //check time before create marker and save visit:
        if (!checkTimeInput()) return;
        //create marker on the map.
        createMarker(place.geometry.location);
        //start point
        if (itinerary.visits.length == 0) {
            //the latlng is get from place.geometry.location from place object passed in saveVisit(), so we pass null to latlng here.
            saveVisit(place, null, startTime, endTime);
        } else {
            //draw route with directionsService.route
            drawNewRoute(markers.length - 2, markers.length - 1, () => {
                //save the place and visit for sending back to the server.
                saveVisit(place, null, startTime, endTime);
            });
        }
    });
}

function getPlaceDetailsByClick(mapsMouseEvent) {
    // Get the latlng from user clicking on the google map.
    //console.log("mapsMouseEvent.latLng.toString(): ", mapsMouseEvent.latLng.toString());
    const [lat, lng] = getLatLngFromString(mapsMouseEvent.latLng.toString());
    //console.log("{ lat, lng } = ", { lat, lng });

    //check time before create marker and save visit:
    if (!checkTimeInput()) return;

    //create marker on the map.
    createMarker(mapsMouseEvent.latLng);

    //Get Place id by Reverse Geocoding the latlng.
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
        {
            location: { lat, lng }
        },
        //Get Place id by Reverse Geocoding result.
        function getPlaceIdFromLatLng(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                //console.log("Reverse Geocoding results\n", results);
                //console.log("all formatted addresses and place ids:");
                //results.map(e => console.log("place_id:", e.place_id, "formatted address:", e.formatted_address));
                //console.log("geocode place_id", results[0].place_id);
                getPlaceDetailsByPlaceId(results[0].place_id, [lat, lng]);
            } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
                //console.log("no place_id mark for this location.");

                if (itinerary.visits.length == 0) {
                    saveVisit(null, [lat, lng], startTime, endTime);
                } else {//not at start point
                    drawNewRoute(markers.length - 2, markers.length - 1, () => {
                        saveVisit(null, [lat, lng], startTime, endTime);
                    });
                }
            } else {
                window.alert("Google Map Geocoder failed due to: " + status);

                if (itinerary.visits.length == 0) {
                    saveVisit(null, [lat, lng], startTime, endTime);
                } else {//not at start point
                    drawNewRoute(markers.length - 2, markers.length - 1, () => {
                        saveVisit(null, [lat, lng], startTime, endTime);
                    });
                }
            }
        }
    );
}

function getPlaceDetailsByPlaceId(placeId, LatLng) {
    const request = {
        placeId: placeId,
        fields: ["name", "formatted_address", "place_id", "geometry"]
    };
    const service = new google.maps.places.PlacesService(map);
    service.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            if (itinerary.visits.length == 0) {
                saveVisit(place, null, startTime, endTime);
            } else {//not at start point
                drawNewRoute(markers.length - 2, markers.length - 1, () => {
                    saveVisit(place, null, startTime, endTime);
                });
            }
        } else {
            window.alert("Google Map PlacesService failed due to: " + status);
            if (itinerary.visits.length == 0) {
                saveVisit(null, LatLng, startTime, endTime);
            } else {//not at start point
                drawNewRoute(markers.length - 2, markers.length - 1, () => {
                    saveVisit(null, LatLng, startTime, endTime);
                });
            }
        }
    });
}

const startTimeInput = document.getElementById("start_time");
const endTimeInput = document.getElementById("end_time");
//variables to store the user input
let startTime;
let endTime;
startTimeInput.addEventListener('change', e => {
    startTime = new Date(e.target.value);
    //console.log("startTime: ", startTime);
});
endTimeInput.addEventListener('change', e => {
    endTime = new Date(e.target.value);
    //console.log("endTime: ", endTime);
});

function checkTimeInput() {
    if (visitCounter == 1) {
        if (!startTime) {
            window.alert("please enter start time for this trip!");
            return false;
        }
        //The start_time must be set to the current time or some time in the future.
        if (startTime < new Date()) {
            window.alert("start time must be set to the current time or some time in the future!");
            return false;
        }
        //start_time inputted
        return true;
    } else {
        if (!startTime || !endTime) {
            window.alert("please enter start and end time for next visit!");
            return false;
        }

        if (startTime >= endTime) {
            window.alert("next visit start time must be set to before end time");
            return false;
        }
        //check if visit time overlapped
        if (startTime < itinerary.visits[visitCounter - 2].start_time || startTime < itinerary.visits[visitCounter - 2].end_time) {
            window.alert("your next visit time interval overlap with the previous visit!");
            return false;
        }
        //The start_time must be set to the current time or some time in the future.
        if (startTime < new Date()) {
            window.alert("start time must be set to the current time or some time in the future!");
            return false;
        }
        //start_time and end_time inputted, and no time overlap.
        return true;
    }
}

/**
 * https://developers.google.com/maps/documentation/javascript/examples/map-latlng-literal#maps_map_latlng_literal-javascript
 * @param {Lat/Lng Object} latlng
 */
function createMarker(latlng) {
    const marker = new google.maps.Marker({
        map: map,
        position: latlng,
        label: "" + visitCounter
    });
    map.setCenter(latlng);
    markers.push(marker);
    //zoomMapToCoverAllMarkers();
    //drawAllRoutes();
    //drawing should be placed to generateVisit() function as directionsService.route haven't give back the result.
    //drawNewRoute(markers.length - 2, markers.length - 1);
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
 * Save the visit so that we can send it back to server later on.
 * finally, generate the visit to the UI.
 * @param {google.maps.places.PlaceResult} place , google map PlaceResult.
 * @param {number[]} LatLng , [lat, lng].
 */
function saveVisit(place, LatLng, startTime, endTime) {
    //place object passed in
    if (place) {
        let latlng = getLatLngFromString(place.geometry.location.toString());
        //name = "", address = "", description = "", google_place_id = ""
        let place_obj = new Place({
            name: place.name,
            address: place.formatted_address,
            google_place_id: place.place_id
        });
        let visit = new Visit(place.name, latlng[0], latlng[1], place_obj, startTime, endTime);
        itinerary.visits.push(visit);
        generateVisit(visit);
    } else {
        let visit = new Visit(LatLng.toString(), LatLng[0], LatLng[1], null, startTime, endTime);
        itinerary.visits.push(visit);
        generateVisit(visit);
    }
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
        <div class="marker"><button type="button" class="btn btn-info" id="memoBtn" data-toggle="modal" data-target="#exampleModal">
        ${visitCounter}
        </button> </div>
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">$ visit counter</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="place" id="reminder">You can edit your reminder here</div>
                        <form id='input-new-memo-form' action="/memos" method="POST" enctype="multipart/form-data">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <input class="input-group-text" id="inputGroupFileAddon01" type='submit' value="Upload">
                                </div>
                                <div class="custom-file">
                                    <input type="file" class="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" name="image"/>
                                    <label class="custom-file-label" for="inputGroupFile01">Choose file</label>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="place">${visit.place ? visit.place.name : [visit.latitude, visit.longitude]}</div>;
        `
    route.appendChild(newVisit);

    visitCounter++;
}

//upload img in memo
const newForm = document.querySelector('#input-new-memo-form')
newForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(newForm)

  // POST /memos
  // Body: formData
  await fetch('/memos', {
    method: 'POST',
    body: formData
  })
})



//edit visit name, or delete the visit.
route.addEventListener('click', editVisitName);
function editVisitName(event) {
    if (event.target.matches(".place")) {

        const oldText = event.target.innerText;

        event.target.innerHTML = `
        <input type="text" value="${oldText}">
        <button type="button" class="btn btn-warning visit-name-edit">Edit</button>
        <button type="button" class="btn btn-danger visit-name-delete">Delete</button>
        <button type="button" class="btn btn-primary visit-name-cancel">Cancel</button>
        `;
        const visitDiv = event.target.parentNode;
        const index = parseInt(visitDiv.dataset.index);
        const editVisit = event.target.querySelector(".visit-name-edit");
        const deleteVisit = event.target.querySelector(".visit-name-delete");
        const cancelEdit = event.target.querySelector(".visit-name-cancel");
        editVisit.addEventListener('click', saveNewVisitName);
        function saveNewVisitName() {
            const newText = event.target.querySelector("input").value;
            itinerary.visits[index].name = newText;
            event.target.innerHTML = newText;
            editVisit.removeEventListener('click', saveNewVisitName);
        }
        deleteVisit.addEventListener('click', deleteThisVisit);
        function deleteThisVisit() {
            //delete the data stored in itinerary and remove the marker and redraw path on the map.
            deleteVisitAt(index);
            //remove this visit div and the transit div above.
            //https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
            //if it is start point, transit div is below.
            if (index == 0) {
                if (itinerary.visits.length > 0) {//more than one visit left.
                    visitDiv.parentNode.querySelectorAll(".transit")[0].remove();
                }
            } else {
                visitDiv.parentNode.querySelectorAll(".transit")[index - 1].remove();
            }
            visitDiv.remove();
            deleteVisit.removeEventListener('click', deleteThisVisit);
        }
        cancelEdit.addEventListener('click', cancelEditVisit);
        function cancelEditVisit() {
            event.target.innerHTML = oldText;
            cancelEdit.removeEventListener('click', cancelEditVisit);
        }
    }
}

//delete visit at index from visits[], marker at index from markers[] and redraw the new path if needed.
function deleteVisitAt(index) {
    itinerary.visits.splice(index, 1);

    markers[index].setMap(null);
    markers.splice(index, 1);
    relabelMarkers(index);
    //remove and redraw path after deleting marker, as path redraw depends on marker location.
    removeAndRedrawPath(index);
}

function removeAndRedrawPath(index) {
    if (index == 0) {//at start point
        paths[0].removeFromMap();
        paths.splice(index, 1);
    } else {
        //remove the path with index-1, which connect the index-1 marker and index marker.
        paths[index - 1].removeFromMap();
        paths.splice(index - 1, 1);
        //not at the end point
        if (index < paths.length - 1) {
            //remove the path with index, which connect the index marker and index+1 marker.
            paths[index - 1].removeFromMap();
            //Insert an element in specific index in JavaScript Array.
            //https://medium.com/javascript-in-plain-english/insert-an-element-in-specific-index-in-javascript-array-9c059e941a67#:~:text=We%20have%20some%20in%2Dbuilt,method%20available%20in%20Array%20object.
            //as the new marker 
            drawNewRoute(index - 1, index, () => { });
        }
    }
}

/**
 * relabeling the markers on the map.
 * See {@link //https://stackoverflow.com/questions/25165511/how-we-set-marker-label-content-by-javascript-in-google-map-api}
 * @param {number} startIndex index to start relabeling.
 */
function relabelMarkers(startIndex) {
    for (let i = startIndex; i < markers.length; i++) {
        markers[i].setLabel((i + 1).toString());
    }
}

/**
 * Draw route from point with index i to point with index j.
 * @param {number} i index for the starting marker location.
 * @param {number} j index for the ending marker location.
 * @param {Function} callback callback to be called after async operation.
 */
function drawNewRoute(i, j, callback) {
    if (markers.length < 2) return; //one or no visit, nothing to draw.
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
    //const selectedMode = document.getElementById("mode").value;
    /* console.log(`calculate route with settings:
    {
        origin: ${origin},
        destination: ${destination},
        travelMode: ${travelMode},
        drivingOptions: {
            departureTime: ${departureTime}
        },
        transitOptions: {
            arrivalTime: ${arrivalTime},
            departureTime: ${departureTime}
        }
    }`); */
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
                paths.push(new Path(directionsRenderer, null));
                callback();
            } else {
                //window.alert("Directions request failed due to " + status);
                //console.log("Directions request failed due to " + status);
                createPolyline([origin, destination], callback);
            }
        }
    );
}

/**Create polyline with array of latlng.
 * Reference {@link https://letswrite.tw/google-map-api-geometry/ Google Maps API學習筆記-2：在地圖上畫個日本結界}
 * @param {Array<LatLng|LatLngLiteral>} path 
 * @param {Function} callback
 */
function createPolyline(path, callback) {
    //console.log("createPolyline with path: ", path);
    const polyline = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: "#0000FF",
        strokeOpacity: 0.5,
        strokeWeight: 6
    });
    polyline.setMap(map);
    paths.push(new Path(null, polyline));
    callback();
}

//save the route title for sending back to the server later.
const routeTitleInput = document.getElementById("itinerary-title");
routeTitleInput.addEventListener('input', saveTitle);
function saveTitle(event) {
    //console.log("route title input: ", event.target.value);
    itinerary.title = event.target.value;
}

const submitItinerary = document.getElementById("submit-itinerary");
submitItinerary.addEventListener("click", sendItinerary);
async function sendItinerary() {
    console.log(itinerary);
    if (!checkItinerary()) return;
    await fetch('/itinerary', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(itinerary)
    });
}

//check itinerary before submitting
function checkItinerary() {
    if (itinerary.visits.length == 0) {
        window.alert("please save at least one visit for this trip!");
        return false;
    }
    if (!itinerary.title) {
        window.alert("please enter itinerary title!");
        return false;
    }
    //at least one visit and title inputted
    return true;
}

//clear itinerary
const clearItinerary = document.getElementById("clear-itinerary");
clearItinerary.addEventListener("click", clearAll);
function clearAll() {
    for (const path of paths) {
        path.removeFromMap();
    }
    paths = [];
    for (const marker of markers) {
        marker.setMap(null);
    }
    markers = [];
    itinerary.title = "";
    itinerary.visits = [];
    route.innerHTML = "";
}