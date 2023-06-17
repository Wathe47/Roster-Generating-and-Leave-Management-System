const mongoose = require("mongoose");

const daySchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    dateName: {
      type: String,
    },
    isHoliday: {
      type: Boolean,
    },
    onSiteEmp: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    remoteEmp: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// daySchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "onSiteEmp",
//     select: "name jobTitle",
//   }).populate({
//     path: "remoteEmp",
//     select: "name jobTitle",
//   });
//   next();
// });

const Day = mongoose.model("Day", daySchema);

module.exports = Day;
