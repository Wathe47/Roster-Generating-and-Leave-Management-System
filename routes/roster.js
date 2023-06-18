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

router.route("/").post(addRosterItem);

router.route("/update/:id").put(updateRosterItem);

router.route("/:id").delete(deleteRosterItem);

module.exports = router;