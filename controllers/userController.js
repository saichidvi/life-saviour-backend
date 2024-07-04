const User = require("../models/userModel");
const Hospital = require("../models/hospitalModel");

const createUser = async (req, res, next) => {
  try {
    const { role, email, mobile, username } = req.body;

    //Check if user exists in the database
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.send("User exists already");
      return;
    }

    //If the role is User
    if (role === "User") {
      const newUser = new User({ role, email, mobile, username });
      await newUser.save();
      res.send(newUser);
      return;
    }

    //If the role is Driver
    if (role === "Driver") {
      const { password, hospitalName } = req.body;

      //Retrive the Id of the hospital
      const hospitalId = await Hospital.findOne({ name: hospitalName });

      //If hospital Id is not found
      if (!hospitalId) {
        res.send("Hospital not found on this Name");
        return;
      }

      const newDriver = new User({
        role,
        email,
        mobile,
        username,
        password,
        hospitalId,
      });
      await newDriver.save();
      res.send(newDriver);
      return;
    }
  } catch (err) {
    console.log("Error in the user controller", err);
  }
};

module.exports = { createUser };
