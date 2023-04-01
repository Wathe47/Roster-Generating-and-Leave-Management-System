const router = require("express").Router();
const {
  getRoster,
  getRosterById,
  addRosterItem,
  updateRosterItem,
  deleteRosterItem,
} = require("../controllers/rosterController");

router.route("/").get(getRoster);

router.route("/:id").get(getRosterById);

router.route("/add").post(addRosterItem);

router.route("/update/:id").post(updateRosterItem);

router.route("/:id").delete(deleteRosterItem);

module.exports = router;
