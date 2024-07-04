const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  location: {
    latitude: {
      type: Number,
      unique: true,
      required: true,
    },
    longitude: {
      type: Number,
      unique: true,
      required: true,
    },
  },
  driverIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  activeDrivers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Hospital = mongoose.model("Hospital", hospitalSchema);

module.exports = Hospital;
