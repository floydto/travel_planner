# WSP-project
idea from www.inspirock.com  

Map:  
Use Google Map.  
Other maps include:
- [OpenStreetMap](https://en.wikipedia.org/wiki/OpenStreetMap)
- [OpenMapTiles](https://openmaptiles.org/)

# Challenges
## Technical Challenges
1. - Google Maps JavaScript API are not promisify. We have to write code in a "nested callbacks" way. 
    - Google Maps API document doesn't tell us which methods are async operation, we need to check them ourselves.
2. - If we want to delete or insert a marker drew, we also need to delete and redraw the paths connecting them. So we need to rethink about a better data structure to abstract these operations.
    - marker - path - marker - path - marker...
    - May need to store the references to previous and next path connecting the marker in one node in a linked list.
3. - As we also want to allow the user to add a memo with many memo images to a visit, when creating the itinerary, we may send too many data in one post request.
    - If we allow adding memos when creating the itinerary, we need to store the memos and images, instead of submitting a memo form, we have to store the form data, and later submitting the data at once.
    - Which is also a problem in multi step form.
4. - If we also store the transportation data, and the Google generated routes, we store too much data.
    - The transport schedule may vary a lot depends on the real time situation, and many type of transport to go to the same place, make storing the transport data in our database a bit meaningless.
    - Google waypoints directions routes calculation service doesn't include transit mode due to the mentioned difficulties and the calculation may consume not of computing power. Google also limit the number of waypoints that we can added in routes calculation.
5. - The vertical timeline alignment is a bit hard to achieve in css. 
    - For responsiveness, changing screen size may distort the alignment.
6. - Google only calculate the route with arrival and departure time in the future, a user may want to save a snapshot of the route as well as the transit information.
    - We need to use Google Geometry library for encoding and decoding polyline paths according to the Encoded Polyline Algorithm.
    - Maybe we need to add an archive function for the itinerary so that we don't generate the routes at real time, but use the stored paths.
# Improvements

# Features to be added in the future# travel_planner
