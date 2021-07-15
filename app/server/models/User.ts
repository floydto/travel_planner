import Itinerary from "./Itinerary";
export default interface User {
    username: string | null,
    email: string,
    password: string | null,
    itineraries: Itinerary[]
};