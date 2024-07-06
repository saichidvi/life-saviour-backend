const mongoose = require("mongoose");

const User = require("../models/userModel");
const OTPModel = require("../models/otpModel");
const Hospital = require("../models/hospitalModel");

const createUser = async (req, res, next) => {
  try {
    const { role, email, mobile, username } = req.body;

    //Check if user exists in the database.
    const existingUser = await User.findOne({ email: email });

    //If the role is User , it comes under booking a ride request.
    if (role === "User") {
      //If user already exists in the DB, just update his details.
      if (existingUser) {
        existingUser.mobile = mobile;
        existingUser.username = username;
        const existingUserResponse = await existingUser.save();
        return {
          status: 201,
          message: "User found in the DB and his details are updated.",
          user: existingUserResponse,
        };
      }

      //If user does not exits , then save his details in the DB.
      const newUser = new User({ role, email, mobile, username });
      await newUser.save();
      return {
        status: 201,
        message: "User created sucessfully.",
        user: newUser,
      };
    }

    //If the role is Driver
    if (role === "Driver") {
      const { password, hospitalId } = req.body;

      //If Driver exists in the DB.
      if (existingUser) {
        const { accountStatus } = existingUser;

        //If he is already verified.
        if (accountStatus === "Verified") {
          return {
            status: 409,
            message: "Driver already exists, please login.",
            user: existingUser,
          };
        }

        //Check whether he changed the hospital details.
        const oldHospitalId = existingUser.hospitalId;
        const newHospitalId = hospitalId;
        //If both the hospitals are different.
        if (newHospitalId !== oldHospitalId) {
          await Hospital.findOneAndUpdate(
            {
              _id: oldHospitalId,
            },
            {
              $pull: {
                driverIds: new mongoose.Types.ObjectId(existingUser._id),
              },
            }
          );
          await Hospital.findOneAndUpdate(
            {
              _id: newHospitalId,
            },
            {
              $push: {
                driverIds: new mongoose.Types.ObjectId(existingUser._id),
              },
            }
          );
        }

        //Now update the existing driver details.
        const updatedUser = await User.findOneAndUpdate(
          { _id: existingUser._id },
          {
            $set: {
              mobile: mobile,
              username: username,
              password: password,
              hospitalId: hospitalId,
            },
          },
          { new: true }
        );

        //Return the updated driver details.
        return {
          status: 201,
          message: "Existing driver details are updated.",
          user: updatedUser,
        };
      }

      //If Driver does not exists in the DB.
      const newDriver = new User({
        role,
        email,
        mobile,
        username,
        password,
        hospitalId: hospitalId,
        status: "sleep",
      });
      await newDriver.save();

      //Now join this driverId in the hospital where he is registerd.
      await Hospital.findOneAndUpdate(
        {
          _id: hospitalId,
        },
        {
          $push: { driverIds: newDriver._id },
        }
      );

      return {
        status: 201,
        message: "Driver created successfully and added to the hospital.",
        user: newDriver,
      };
    }
  } catch (err) {
    return {
      status: 500,
      message: "Error occured while creating a user.",
      err: err.message,
    };
  }
};

const authenticateUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const currentUser = await User.findOne({ email: email });

    //Verify the password entered using the methods on these User schema.
    currentUser.comparePassword(password, (err, isValid) => {
      if (err) {
        return res.status(500).json({
          message: "Error while  comparing the password.",
          errMessage: err.message,
        });
      }

      if (isValid) {
        req.session.userId = currentUser._id;
        req.session.save();
        return res.status(201).json({
          message: "User verified successfully.",
        });
      }

      //If user is not verified.
      return res.status(401).json({
        message: "Invalid , credentials.",
      });
    });
  } catch (err) {
    res.send({
      status: 500,
      message: "Error occured in the user controller , authenticate.",
      errMessage: err.message,
    });
  }
};

const updateDriverStatus = async (req, res, next) => {
  try {
    const { userId, status } = req.body;
    const currentDriver = await User.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $set: {
          accountStatus: status,
        },
      },
      {
        new: true,
      }
    );

    //Update the hospital active drivers array.
    const updateQuery =
      status === "active"
        ? { $push: { activeDrivers: userId } }
        : { $pull: { activeDrivers: userId } };

    await Hospital.findOneAndUpdate(
      { _id: currentDriver.hospitalId },
      updateQuery
    );
    res.status(201).json({
      message: "Driver status updated perfectly.",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateStatus = async (req, res, next) => {
  try {
  } catch (err) {
    res.send({
      status: err.status,
      message: "Error occured while updating the status of the driver.",
      errMessage: err.message,
    });
  }
};

module.exports = { createUser, authenticateUser };
