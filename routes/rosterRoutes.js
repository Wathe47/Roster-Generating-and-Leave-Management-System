const express = require("express");
const rosterController = require("../controllers/rosterControllerv2");
const authController = require("../controllers/authController");

const router = express.Router();

// @route POST api/rosters/
// @desc Get all working days in a given week
// @access Private (Admin Only)

router.route("/").post(authController.protect, rosterController.createRoster);

// @route GET api/rosters/:id
// @desc Get a roster by id
// @access Private Login Required

router.route("/:id").get(authController.protect, rosterController.getRoster);

router.route("/working-days").get(rosterController.getWorkingDays);

// @route GET api/rosters/testing-functions
// @desc test the functions
// @access Private (Admin Only)

router.route("/testing-functions").get(rosterController.testingFunctions);

module.exports = router; // Export the router
