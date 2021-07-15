import Image from "./Image";

export default interface Place {
    id: string,
    google_place_id: string,
    name: string,
    address: string,
    description: string,
    love: number,
    images: Image[]
};