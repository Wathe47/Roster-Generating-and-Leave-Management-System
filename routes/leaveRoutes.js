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
router.route("/").post(authController.protect, leaveController.createLeave);

// @route GET api/leaves/mine
//        - GET api/leaves/mine?status=approved
//        - GET api/leaves/mine?status=pending
// @desc Get all leaves of a user
// @access Private (Login Users)
router.route("/mine").get(authController.protect, leaveController.getMyLeaves);

// @route PUT api/leaves/approve
// @desc Approve/Reject Leave
// @access Private (Admin Only)
router
  .route("/approve")
  .put(
    authController.protect,
    authController.restrictTo(
      "Chief Executive Officer",
      "Chief Operating Officer",
      "Human Resources/Administrative"
    ),
    leaveController.approveLeave
  );

// @route GET api/leaves/eligibleList
// @desc Get all eligibleList of users for given date
// @access Private (Admin Only)

router.route("/:id").get(leaveController.getLeave);

module.exports = router; // Export the router
