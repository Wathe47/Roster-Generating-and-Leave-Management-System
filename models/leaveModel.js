const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
    },
    status: {
      type: String,
      default: "Pending",
    },
    reason: {
      type: String,
    },
    approved_rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

LeaveSchema.pre("save", async function (next) {
  this.noofdays = this.date.length;
  next();
});

LeaveSchema.methods.approveLeave = function (
  status,
  reason,
  approved_rejectedBy
) {
  this.status = status;
  this.reason = reason;
  this.approved_rejectedBy = approved_rejectedBy;
  this.save();
};

const Leave = mongoose.model("Leave-Request", LeaveSchema);
// create a model from the schema

module.exports = Leave; // export the model
