const nodemailer = require("nodemailer");

//Variables
const googleEmail = process.env.GOOGLE_GMAIL_MAIL;
const googleGamailPass = process.env.GOOGLE_GMAIL_PASS;

const generateOTP = () => {
  const randomNum = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  return randomNum.toString().padStart(6, "0");
};

const sendMail = async (email) => {
  const OTP = generateOTP();
  console.log("In emial");
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: googleEmail,
      pass: googleGamailPass,
    },
  });

  try {
    const info = await transport.sendMail({
      from: googleEmail,
      to: email,
      subject: "Your OTP for Life-Savior",
      html: `<p>Please enter this OTP - ${OTP} </p>`,
    });

    //If email is sent successfully
    return {
      status: 200,
      message: "Email sent successfully.",
      OTP: OTP,
      info: info,
    };
  } catch (err) {
    return {
      status: 400,
      message: "Error while sending the email.",
      err: err,
    };
  }
};

module.exports = sendMail;
