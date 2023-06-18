const mongoose = require("mongoose");

const rosterSchema = new mongoose.Schema(
  {
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    period: {
      type: String,
    },
    days: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Day",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// rosterSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "days",
//     select: "-_id -createdAt -updatedAt -__v",
//   }).populate({
//     path: "createdBy",
//     select: "name jobTitle",
//   });

//   next();
// });

rosterSchema.pre("save", function (next) {
  this.period = `${this.startDate} - ${this.endDate}`;
  next();
});

const Roster = mongoose.model("Roster", rosterSchema);

module.exports = Roster;
