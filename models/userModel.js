const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    trim: true,
  },
  mobile: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    enum: ["User", "Driver"],
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "sleep"],
  },
  accountStatus: {
    type: String,
    enum: ["verified", "notVerified"],
    default: "notVerified",
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
  },
  previousRides: [{ type: mongoose.Schema.Types.ObjectId, ref: "Request" }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    // next(error); Middleware should be declared at last
    console.log("Error occured");
  }
});

userSchema.methods.comparePassword = function (plainText, callBack) {
  bcrypt.compare(plainText, this.password, (err, isMatch) => {
    if (err) return callBack(err);
    callBack(null, isMatch);
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
