const express = require("express");
const router = express.Router();
const { createUser } = require("../controllers/userController");

router.post("/signUp", async (req, res, next) => {
  console.log("API coreectly went hit");
  createUser(req, res, next);
});

router.post("/signIn", async (req, res, next) => {});

module.exports = router;
