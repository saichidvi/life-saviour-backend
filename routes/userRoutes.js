const express = require("express");
const router = express.Router();

//Import the controllers
const { assignOtp } = require("../controllers/otpController.js");
const {
  createUser,
  authenticateUser,
} = require("../controllers/userController");
const { verifyOTP } = require("../controllers/otpController.js");

//Import the middlewares
const sendEmail = require("../middlewares/sendEmail.js");

//Only drivers register through this route.
router.post("/signUp", async (req, res, next) => {
  try {
    const driverResponse = await createUser(req, res, next);

    //Check if there are any internal server issues while creating the driver.
    if (driverResponse.status === 500 || driverResponse.status === 409) {
      res.send(driverResponse);
      return;
    }

    //Generate the OTP for this ride.
    const { email: driverEamil } = req.body;
    const emailResponse = await sendEmail(driverEamil);

    //Some issue during sending OTP to the driver.
    if (emailResponse.status === 400) {
      res.send(emailResponse);
      return;
    }

    //If email is send correclty, then assign the OTP with the driverId.
    const otpResponse = await assignOtp(req, res, next, emailResponse.OTP);
    if (otpResponse.status === 500) {
      res.send(otpResponse);
      return;
    }

    //Send the reponse to the client.
    res.send({
      driverResponse,
      emailResponse,
      otpResponse,
    });
  } catch (err) {
    res.send({
      status: err.status,
      message: "Error while registering the driver.",
      errMessage: err.message,
    });
  }
});

//When driver want to change his status to the active.
router.put("/updateStatus/:id", async (req, res, next) => {
  try {
  } catch (err) {}
});

//When driver want to signIn into his account.
router.post("/signIn", async (req, res, next) => {
  authenticateUser(req, res, next);
});

//When ever driver want to signOut his account.
router.post("/signOut", async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Logout failed", error: err.message });
    }
    return res.status(200).json({ message: "Logout successful" });
  });
});

//When driver want to verify his profile.
router.put("/verifyOTP", async (req, res, next) => {
  try {
    const OTPresponse = await verifyOTP(req, res, next);
    if (OTPresponse.status === 201) {
      req.session.user_id = req.body.userId;
    }
    return res.send(OTPresponse);
  } catch (err) {
    return res.status(500).json({
      message: "Error while verifying the OTP in the User route.",
      errMessage: err.message,
    });
  }
});

module.exports = router;
