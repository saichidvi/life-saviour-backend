const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

//Import the requred files
require("./db.config");

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(
  session({
    key: "user_id",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 100000,
    },
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Import the routes
const userRoute = require("./routes/userRoutes.js");
const hospitalRoute = require("./routes/hospitalRoutes.js");

//SessionChecker a middleware function
const SessionChecker = (req, res, next) => {
  if (req.session.user && req.cookie) {
  } else {
    next();
  }
};

// Routes
app.get("/api", (req, res) => {
  res.send("Hello, world!");
});
app.use("/api/user", userRoute);
app.use("/api/hospital", hospitalRoute);

// Example API route
app.get("/api/example", (req, res) => {
  res.json({ message: "This is an example API endpoint" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
