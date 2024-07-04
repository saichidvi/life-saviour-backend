const express = require("express");
const router = express.Router();

//Import the controllers
const { createHospital } = require("../controllers/hospitalController");

router.post("/create", async (req, res, next) => {
  createHospital(req, res, next);
});

module.exports = router;
