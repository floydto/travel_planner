function initMap() {
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 14,
      center: { lat: 37.77, lng: -122.447 }
    });
    directionsRenderer.setMap(map);
    calculateAndDisplayRoute(directionsService, directionsRenderer);
    document.getElementById("mode").addEventListener("change", () => {
      calculateAndDisplayRoute(directionsService, directionsRenderer);
    });
  }
  
  let dirTransitInfo; 

  function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    const selectedMode = document.getElementById("mode").value;
    directionsService.route(
      {
        origin: { lat: 22.372662, lng: 114.108115 },
        destination: { lat: 22.314098, lng: 114.258819 },
        // Note that Javascript allows us to access the constant
        // using square brackets and a string value as its
        // "property."
  
        travelMode: google.maps.TravelMode[selectedMode]
      },
      (response, status) => {
        if (status == "OK") {
          //console.log(response);
          console.log(response.routes[0].legs[0]);
          dirTransitInfo = response.routes[0].legs[0]; 
          directionsRenderer.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }