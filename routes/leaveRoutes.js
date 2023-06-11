const express = require("express");
const leaveController = require("../controllers/leaveController");
const authController = require("../controllers/authController");

const router = express.Router();

// @route GET api/leaves
// @desc Get all leaves
// @access Private, (Admin Only)
router.route("/").get(leaveController.getAllLeaves);

// @route POST api/leaves
// @desc Request Leaves
// @access Private (Login Users)
router.route("/").post(leaveController.createLeave);

// @route GET api/leaves/mine
//        - GET api/leaves/mine?status=Approved
//        - GET api/leaves/mine?status=Pending
// @desc Get all leaves of a user
// @access Private (Login Users)
router.route("/mine").get(leaveController.getMyLeaves);

// @route PUT api/leaves/approve/:id
// @desc Approve/Reject Leave
// @access Private (Admin Only)
router.route("/approve/:id").put(leaveController.approveLeave);

// @route GET api/leaves/eligibleList
// @desc Get all eligibleList of users for given date
// @access Private (Admin Only)
router.route("/eligibleList/:date").get(leaveController.getEligibleList);

router.route("/:id").get(leaveController.getLeave);

module.exports = router; // Export the router
