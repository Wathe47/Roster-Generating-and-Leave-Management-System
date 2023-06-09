const express = require("express");
const rosterController = require("../controllers/rosterControllerv2");

const router = express.Router();

// @route GET api/rosters/workingDays
// @desc Get all working days in a given week
// @access Private (Admin Only)

router.route("/working-days").get(rosterController.getWorkingDays);

// @route GET api/rosters/testing-functions
// @desc test the functions
// @access Private (Admin Only)

router.route("/testing-functions").get(rosterController.testingFunctions);

module.exports = router; // Export the router
