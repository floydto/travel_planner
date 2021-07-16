import express,{Request,Response} from 'express';
import {client} from '../config/db';
import {upload} from '../app';


export const memoRoutes = express.Router();

memoRoutes.post('/memos', upload.single('image'),postMemo )

export async function postMemo(req:Request, res:Response){

    const ids =  (await client.query(/*sql*/`INSERT INTO memo_img (img_path,updated_at,visit_id) 
            VALUES ($1,NOW(),$2) RETURNING id`,[req.file?.filename,req.visit.id])).rows;
    console.log(ids);
    res.result('upload ok');
}

