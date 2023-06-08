const express = require("express");
const roasterController = require("../controllers/rosterControllerv2");

const router = express.Router();

// @route GET api/roaster/workingDays
// @desc Get all working days in a given week
// @access Private (Admin Only)

router.route("/working-days").get(roasterController.getWorkingDays);

module.exports = router; // Export the router
