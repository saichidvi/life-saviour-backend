const mongoose = require("mongoose");
//Import the model
const User = require("../models/userModel");
const OTPModel = require("../models/otpModel");

const assignOtp = async (req, res, next, OTP) => {
  try {
    const { email } = req.body;
    const { _id: userId } = await User.findOne({ email: email });
    const newOtp = new OTPModel({ userId: userId, OTP: OTP });
    const response = await newOtp.save();
    return {
      status: 201,
      message: "Otp assigned to the userId.",
      OTP: response,
    };
  } catch (err) {
    return {
      status: 500,
      message: "Error occured while assigning otp.",
      err: err,
    };
  }
};
const verifyOTP = async (req, res, next) => {
  try {
    const { userId, OTP } = req.body;
    const pipeline = [
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $sort: { createdAt: -1 } },
      { $limit: 1 },
    ];
    const latestOTP = await OTPModel.aggregate(pipeline);
    if (latestOTP.length === 0) {
      return {
        status: 404,
        message: "No, OTP`s are generated on this UserId.",
      };
    }

    //After getting the latest OTP document , we need to check the OTP entered by the user.
    if (latestOTP[0].OTP !== OTP) {
      return {
        status: 401,
        message: "Incorrect OTP entered please re-enter the latest OTP.",
      };
    }
    await User.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $set: {
          accountStatus: "Verified",
        },
      }
    );
    return {
      status: 201,
      message: "OTP veirified successfully and user account status is changed.",
    };
  } catch (err) {
    return {
      status: 500,
      message: "Error while verifying the user.",
      errMessage: err.message,
    };
  }
};

module.exports = { assignOtp, verifyOTP };
