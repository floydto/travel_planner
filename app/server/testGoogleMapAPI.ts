import { Client } from "@googlemaps/google-maps-services-js";
import dotenv from 'dotenv';
import fs from "fs";
dotenv.config();

const client = new Client({});
client
  .placeDetails({
    params: {
      place_id: "ChIJXSModoWLGGARILWiCfeu2M0",
      key: process.env.GOOGLE_MAPS_API_KEY ? process.env.GOOGLE_MAPS_API_KEY : ""
    },
    timeout: 1000 // milliseconds
  })
  .then(r => {
    console.log(r.data.result);
    fs.writeFileSync("placeDetails.json",JSON.stringify(r.data.result));
  })
  .catch(e => {
    console.log(e);
  });