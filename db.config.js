const mongoose = require("mongoose");
const mongoDB_URI = process.env.MONGO_URI;
mongoose
  .connect(mongoDB_URI)
  .then(() => console.log("Database connected successfully."))
  .catch((err) => console.log(err));
