import Visit from "./Visit";

export default interface Itinerary {
    id: string,
    title: string,
    love: number,
    visits: Visit[]
};