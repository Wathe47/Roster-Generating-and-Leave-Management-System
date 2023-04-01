const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const rosterSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    checkedIn: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

const Roster = mongoose.model("Roster", rosterSchema);

module.exports = Roster;
