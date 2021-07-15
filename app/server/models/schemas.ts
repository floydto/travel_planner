namespace schemas {

    export namespace Itinerary {
        export type id = number;
        export type title = string;
        export type love = number;
        export type is_private = boolean;
        export type created_at = Date;
        export type updated_at = Date;
        export type is_deleted = boolean;
        export type users_id = number;
        export interface Itinerary {
            id: id,
            title: title,
            love: love,
            is_private: is_private,
            created_at: created_at,
            updated_at: updated_at,
            is_deleted: is_deleted,
            users_id: users_id
        };
    };

    export namespace User {
        export type id = number;
        export type username = string | null;
        export type email = string;
        export type password = string | null;
        export type created_at = Date;
        export type updated_at = Date;
        export type is_deleted = boolean;
        export interface User {
            id: number,
            username: string | null,
            email: string,
            password: string | null,
            created_at: Date,
            updated_at: Date,
            is_deleted: boolean
        };
    }

    export namespace Transport {
        export interface Transport {
            id: number,
            transit_line_name: string,
            vehicle_type: string,
            arrival_stop: string,
            departure_stop: string,
            arrival_time: Date,
            departure_time: Date
        };
    }

    export namespace Place {
        export type id = number;
        export type google_place_id = string;
        export type name = string;
        export type address = string;
        export type description = string;
        export type love = number;
        export interface Place {
            id: id,
            google_place_id: google_place_id,
            name: name,
            address: address,
            description: description,
            love: love
        };
    }

    export namespace Visit {
        export type id = string;
        export type name = string;
        export type latitude = number;
        export type longitude = number;
        export type start_time = Date;
        export type end_time = Date;
        export type is_deleted = boolean;
        export type itinerary_id = number;
        export type transport_id = number;
        export type place_id = number;
        export interface Visit {
            id: id,
            name: name,
            latitude: latitude,
            longitude: longitude,
            start_time: start_time,
            end_time: end_time,
            is_deleted: is_deleted,
            itinerary_id: itinerary_id,
            transport_id: transport_id,
            place_id: place_id
        };
    }

}

export default schemas;