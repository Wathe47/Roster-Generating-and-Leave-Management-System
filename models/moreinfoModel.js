const mongoose = require("mongoose");

const moreinfoSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    distance: {
      type: Number,
      required: [true, `Distance required!`],
    },
    distancePriority: {
      type: Number,
    },
    isPregnant: {
      type: Boolean,
      default: false,
    },
    hasInfantChildren: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//PRE-MIDDLEWARE - DOCUMENT MIDDLEWARE: runs before .save() and .create()
moreinfoSchema.pre("save", async function (next) {
  if (this.distance < 20) {
    this.distancePriority = 1;
  } else if (this.distance < 40) {
    this.distancePriority = 2;
  } else {
    this.distancePriority = 3;
  }
  next();
});

const MoreInfo = mongoose.model("MoreInfo", moreinfoSchema);

module.exports = MoreInfo;
