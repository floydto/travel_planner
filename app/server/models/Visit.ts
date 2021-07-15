import Place from "./Place";
import Transport from "./Transport";
import Image from "./Image";

export default interface Visit {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    place?: Place;
    start_time: Date;
    end_time: Date;
    transport?: Transport;
    memo_title?: string;
    memo_content?: string;
    memo_images?: Image[];
}