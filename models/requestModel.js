const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  status: {
    type: String,
    enum: ["raised", "assigned", "completed"],
    required: true,
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Ride = mongoose.model("Ride", rideSchema);

module.exports = Ride;
