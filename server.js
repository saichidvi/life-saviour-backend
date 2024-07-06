const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");

//Create an express application
const app = express();

//Use these env variables through out the project
require("dotenv").config();
const port = process.env.PORT || 3000;

//Configure the databse
require("./db.config");

// Middlewares used for smooth experience
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan("dev"));
app.use(
  session({
    key: "user_id",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 100000,
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Import the routes
const userRoute = require("./routes/userRoutes.js");
const rideRoute = require("./routes/rideRoutes.js");
const hospitalRoute = require("./routes/hospitalRoutes.js");

//Handleing various routes
app.use("/life-saviour-api/user", userRoute);
app.use("/life-saviour-api/ride", rideRoute);
app.use("/life-saviour-api/hospital", hospitalRoute);

//Start the server
app.listen(port, () => {
  console.log(`Server is running on port number: ${port}.`);
});
