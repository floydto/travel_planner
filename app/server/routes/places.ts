import express,{Request,Response} from 'express';
import {client} from '../config/db';  

export const places = express.Router();


places.get('/places',getPlaces);
places.get(`/attractions`,getAttractions);
places.get('/plan_mgt', getAttractions);


async function getPlaces(req:Request, res:Response){
    const places:any[] = (await client.query(`SELECT p.name,p.description, p.love, pi.img_path, p.id
    FROM place p 
    LEFT JOIN place_img pi
    on p.id = pi.place_id
    ORDER BY p.love DESC
    LIMIT 5`)).rows;
    //console.log(places);
    res.json(places);
}

async function getAttractions(req:Request, res:Response){
    if(parseInt(req.query.id+"") != NaN){
    const attractions:any[] = (await client.query(`SELECT p.name,p.description, p.love, pi.img_path, p.id
    FROM place p 
    LEFT JOIN place_img pi
    on p.id = pi.place_id
    where pi.place_id = $1
    `,[req.query.id])).rows;
    console.log(attractions)
    res.json(attractions);
    }
}




