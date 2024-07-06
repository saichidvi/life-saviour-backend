const express = require("express");
const router = express.Router();

//Improt the middlwares
const sendEmail = require("../middlewares/sendEmail.js");

//Import the controllers
const { assignOtp } = require("../controllers/otpController.js");
const { createUser } = require("../controllers/userController.js");

//When a user want to book an ambulance.
router.post("/requestRide", async (req, res, next) => {
  try {
    //Save user details if he is a new user , or else retrive his old details.
    const userResponse = await createUser(req, res, next);

    //Check if there are any internal server issues while creating the user.
    if (userResponse.status === 500) {
      res.send(userResponse);
      return;
    }

    //Generate the OTP for this ride.
    const { email: userEmail } = req.body;
    const emailResponse = await sendEmail(userEmail);

    //Some issue during sending OTP to the user.
    if (emailResponse.status === 400) {
      res.send(emailResponse);
      return;
    }

    //If email is send correclty, then assign the OTP with the userId.
    const otpResponse = await assignOtp(req, res, next, emailResponse.OTP);
    if (otpResponse.status === 500) {
      res.send(otpResponse);
      return;
    }

    //Send the reponse to the client.
    res.send({
      userResponse,
      emailResponse,
      otpResponse,
    });
  } catch (err) {
    res.send({
      status: 500,
      message: "Error occured while rasing the ride request.",
      err: err,
    });
  }
});

module.exports = router;
