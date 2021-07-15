import express from "express";
import expressSession from "express-session";
import bodyParser from "body-parser";
import { logger } from "./middlewares/logger";
import authRoutes from "./routes/auth.route";
import itineraryRoutes from "./routes/itinerary.route";
import { places } from "./routes/places";
import multer from "multer";

//express app setup
const app = express();
const PORT = 7000;
app.listen(PORT, () => {
  console.log(`express app listening at http://localhost:${PORT}`);
});

//Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//setup session
app.use(
  expressSession({
    secret: "Travel itinerary social platform",
    resave: true,
    saveUninitialized: true,
  })
);

//
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/uploads`);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split("/")[1]}`);
  },
});
export const upload = multer({ storage: storage });

//logging for all requests to this server.
app.use(logger);
//routers
//router for login, sign up, log out
app.use(authRoutes);
//router for CRUD on itinerary.
app.use(itineraryRoutes);
//router to read places and attractions.
app.use(places);

//serving static files
app.use(express.static("../client/public"));
//for testing google Maps Javascript API
app.use(express.static("../client/google-map-test"));
//upload static files
app.use(express.static("../client/upload"));

    app.use(express.static("../client/private"));
