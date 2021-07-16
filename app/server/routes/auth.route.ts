import express from 'express';
import { Request, Response } from "express";
import { client } from "../config/db";
import { checkPassword, hashPassword } from "../config/hash";
import dotenv from 'dotenv';
dotenv.config();
import grant from 'grant-express';
import fetch from "node-fetch";

let authRoutes = express.Router();
//OAuth login with google
authRoutes.use(grant({
    "defaults":{
        "protocol": "http",
        "host": "localhost:7000",
        "transport": "session",
        "state": true,
    },
    "google":{
        "key": process.env.GOOGLE_CLIENT_ID || "",
        "secret": process.env.GOOGLE_CLIENT_SECRET || "",
        "scope": ["profile","email"],
        "callback": "/login/google"
    },
}));
authRoutes.post("/login", login);
authRoutes.get("/login", function (req, res) {
    res.redirect("/login(structured).html")
} );
authRoutes.post("/signup", signup);
authRoutes.get("/login/google", loginGoogle);
authRoutes.get("/currentUser", currentUser)
authRoutes.get("/logout",logout)

//logout
async function logout (req: Request, res: Response){
    if(req.session){
        delete req.session.user
    }
    res.redirect('/') 
} 

//login
async function login(req: Request, res: Response) {
    let email = req.body.email
    let password = req.body.password
    let remember = req.body.remember
    
    try {
        let result = await client.query(`SELECT * FROM users where email = $1`, [email])
        console.log(result.rows[0].id)
        if (result.rows[0]) {
            let check = await checkPassword(password, result.rows[0].password)
            if (check) {
                if (req.session) {
                    req.session.user = {
                        id: result.rows[0].id,
                        username: result.rows[0].username,
                        email: result.rows[0].email
                    };
                    //console.log("session:",req.session.user)
                    if (remember) { req.session.cookie.maxAge = 2592000000; }
                }
                //return res.redirect('/welcome_member.html')
                return res.redirect('/')
            }
        }
    } catch (error) {
        res.end("An error occur", error)
        return
    }
    res.redirect("/?username=incorrect&password=incorrect");
    };



    

//current user
async function currentUser(req:Request, res:Response) {
    if (req.session && req.session.user != null) {
    res.json({ result: "ok", user: req.session?.user.username });
    } else {
    res.status(401).json({ result: "Unauthorized" });
    }
};

//sign up
async function signup(req: Request, res: Response) {
    console.log(req.body);
    if (req.body.password != req.body["password-repeat"]) {
        res.send("password mismatch")
    } else {
        // res.json("Congratulation! Your registration was successful!")
    res.redirect('/')
    }
    const { username, email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    await client.query(
        "insert into users (username, email, password) VALUES ($1, $2, $3)",
        [username, email, hashedPassword]
    );
}

// Oauth from google
async function loginGoogle (req:express.Request,res:express.Response){
    const accessToken = req.session?.grant.response.access_token;
    const fetchRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo',{
        method:"get",
        headers:{
            "Authorization":`Bearer ${accessToken}`
        }
    });
    
    const result = await fetchRes.json();
    console.log(result)
    const users = (await client.query(`SELECT * FROM users WHERE users.username = $1`,[result.email])).rows;
    const user = users[0];
    if(!user){
        var randomString = Math.random().toString(36).slice(-8);
        const newUser = await client.query(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *`, [result.name, result.email, randomString])
        if (req.session){
            req.session.user = {
                id: newUser.rows[0].id,
                username: newUser.rows[0].username,
                email: newUser.rows[0].email,
            }
        }
        return res.redirect('/')
    } 
    if (req.session) {
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };
    }
    return res.redirect('/')
  }
   

export default authRoutes;




