const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const rosterSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    checkInTime: { type: Date },
    checkOutTime: { type: Date },
    checkedIn: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

rosterSchema.pre("save", function (next) {
  if (this.isModified("checkedIn") && this.checkedIn) {
    this.checkInTime = Date.now();
  } else if (this.isModified("checkedIn") && !this.checkedIn) {
    this.checkOutTime = Date.now();
  }
  next();
});

const Roster = mongoose.model("Roster", rosterSchema);

module.exports = Roster;
