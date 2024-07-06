const User = require("../models/userModel");
const Hospital = require("../models/hospitalModel");

const createHospital = async (req, res, next) => {
  try {
    const { location, hospitalName } = req.body;

    //Check if the hospital exists on this name
    const existingHospital = await Hospital.findOne({ name: hospitalName });
    if (existingHospital) {
      res.send("Hospital exists on this name.");
      return;
    }

    const newHospital = new Hospital({
      name: hospitalName,
      location: location,
      driverIds: [],
    });

    await newHospital.save();
    res.send(newHospital);
  } catch (err) {
    console.log("Got error in the hospital controller", err);
    res.send(RangeError);
  }
};

module.exports = { createHospital };
