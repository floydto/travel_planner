import express, { Request, Response } from 'express';
import { client } from '../config/db';
import Itinerary from '../models/Itinerary';
import Visit from "../models/Visit";
import Image from "../models/Image";
//import { isLoggedIn } from './guard';

let itineraryRoutes = express.Router();
//public itineraries
itineraryRoutes.get('/itinerary/hot', getHotItineraries);

//get all itineraries for current user.
itineraryRoutes.get('/itinerary/all', getAllItinerary);

//should check if:
//1. itineraries user_id match the session user id.
//2. is_private and is_delete.
itineraryRoutes.get('/itinerary/:id', getItinerary);

//create a whole new itinerary for the current user.
itineraryRoutes.post('/itinerary', createItinerary)
// itinerary.put('/itinerary/:id', isLoggedIn, upload.single('image'), putItinerary );
// itinerary.delete('/itinerary/:id',isLoggedIn,deleteItinerary);



async function getHotItineraries(req: Request, res: Response) {
    const itineraries: any[] = (await client.query(`
    SELECT 
        i.title, 
        i.love, 
        u.username, 
        (select place_img.img_path 
            from place_img 
            inner join place on place_img.place_id = place.id
            inner join visit on place.id = visit.place_id
            where visit.itinerary_id = i.id
            limit 1) as img_path
    FROM itinerary i 
    INNER JOIN users u
    on i.users_id = u.id
    ORDER BY i.love DESC
    LIMIT 3`)).rows;
    
    console.log(itineraries);
    res.json(itineraries);
}

async function getItinerary(req: Request, res: Response) {
    try {
        //How can I create an object based on an interface file definition in TypeScript?
        //https://stackoverflow.com/questions/13142635/how-can-i-create-an-object-based-on-an-interface-file-definition-in-typescript
        let itinerary: Itinerary = {
            id: "",
            title: "",
            love: 0,
            visits: []
        }
        itinerary.id = req.params.id;
        //show the itinerary if the user own it or it is public and not deleted.
        //const itineraryData = (await client.query(`SELECT * FROM itinerary WHERE id = $1 AND (users_id = $2 OR NOT is_private) AND NOT is_deleted`, [itinerary.id, req.session?.user.id])).rows[0];
        const itineraryData = (await client.query(`SELECT * FROM itinerary WHERE id = $1 AND (users_id = $2 OR NOT is_private) AND NOT is_deleted`, [itinerary.id, 1])).rows[0];
        if (!itineraryData) {
            res.json({ result: "Unauthorized or Deleted" });
        }
        //populate itinerary data
        itinerary.title = itineraryData.title;
        itinerary.love = itineraryData.love;

        const wholeItineraryData = (await client.query(
            `SELECT i.title, i.love, 
            v.id AS visit_id, v.name, v.latitude, v.longitude, v.start_time, v.end_time, 
            v.memo_title, v.memo_content, v.place_id, 
            mi.id AS memo_img_id, mi.img_path 

            FROM itinerary AS i
            LEFT JOIN visit AS v
            ON i.id = v.itinerary_id
            LEFT JOIN memo_img AS mi
            ON v.id = mi.visit_id

            WHERE i.id = $1`,
            [itinerary.id])).rows;
        //for debugging
        //for (const row of wholeItineraryData) {console.log(row);}
        //res.json(wholeItineraryData);
        let groupedVisit = new Map();
        for (let row of wholeItineraryData) {
            const memo_img: Image = {
                id: row.memo_img_id,
                img_path: row.img_path
            };
            if (groupedVisit.has(row.visit_id)) {
                groupedVisit.get(row.visit_id).memo_images.push(memo_img);
            } else {
                const visit: Visit = {
                    id: row.visit_id,
                    name: row.name,
                    latitude: row.latitude,
                    longitude: row.longitude,
                    start_time: row.start_time,
                    end_time: row.end_time,
                    memo_title: row.memo_title,
                    memo_content: row.memo_content,
                    memo_images: [memo_img]
                };
                groupedVisit.set(row.visit_id, visit);
            }
        }
        itinerary.visits = Array.from(groupedVisit.values());
    } catch (error) {
        console.error(error);
    }
}

async function createItinerary(req: Request, res: Response) {
    try {
        console.dir(req.body, { depth: 6 });
        const itinerary: Itinerary = req.body;
        //insert the new itinerary.
        console.log("req.session", req.session);
        const itinerary_result = (await client.query(
            `INSERT INTO itinerary (title,created_at,updated_at,users_id) 
            VALUES ($1,NOW(),NOW(),$2) RETURNING id`,
            [itinerary.title, req.session?.user.id]));
        console.log("itinerary_result: ", itinerary_result);
        const itinerary_id = itinerary_result.rows[0].id;

        console.log("new itinerary id", itinerary_id);
        //insert visits and places of this itinerary.
        for (const visit of itinerary.visits) {
            const place = visit.place;
            if (place) {//place is not null or undefined
                //https://stackoverflow.com/questions/13918449/insert-values-if-records-dont-already-exist-in-postgres/34182503
                //Insert values if records don't already exist in Postgres
                let place_id = (await client.query(`SELECT id FROM place WHERE google_place_id = $1`,
                    [place.google_place_id])).rows[0];
                if (!place_id) {
                    place_id = (await client.query(
                        `INSERT INTO place (name, google_place_id, address) VALUES ($1,$2,$3 ) RETURNING id`,
                        [place.name, place.google_place_id, place.address])).rows[0].id;
                }
                console.log("place_id", place_id);
                //How to save JS Date.now() in PostgreSQL?
                //https://stackoverflow.com/questions/42876071/how-to-save-js-date-now-in-postgresql
                //Data Types
                //https://node-postgres.com/features/types
                const visit_id = (await client.query(
                    `INSERT INTO visit (name, latitude, longitude, start_time, end_time, itinerary_id, place_id) 
                        VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
                    [visit.name, visit.latitude, visit.longitude, visit.start_time, visit.end_time, itinerary_id, place_id])).rows[0].id;
                console.log("visit_id: ", visit_id, "with place_id:", place_id);
            } else {
                const visit_id = (await client.query(
                    `INSERT INTO visit (name, latitude, longitude, start_time, end_time, itinerary_id) 
                    VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
                    [visit.name, visit.latitude, visit.longitude, visit.start_time, visit.end_time, itinerary_id])).rows[0].id;
                console.log("visit_id: ", visit_id, "without place details.");
            }
        }
        res.json({ success: true, itinerary_id: itinerary_id });
    } catch (error) {
        console.error(error);
    }
}

async function getAllItinerary(req: Request, res: Response) {
    try {
        console.log("in get all itinerary");
        const itineraryData = (await client.query(`SELECT * FROM itinerary WHERE users_id = $1 AND NOT is_deleted`, [req.session?.user.id])).rows;
        console.log(itineraryData);
        console.log("after SQL");
        res.json(itineraryData);
    } catch (error) {
        console.error(error);
    }
}
// export async function putItinerary(req:Request,res:Response){
//     await client.query(`UPDATE memos SET content = $1, image = $2, updated_at = NOW() WHERE id = $3`,
//             ['revisedTitle','',req.params.id]);
//     res.json({result: 'ok'})
// }

// export async function deleteItinerary(req:Request,res:Response){
//     await client.query(`DELETE FROM memos where id = $1`,[req.params.id]);
//     res.json({result: 'ok'})
// }

export default itineraryRoutes;