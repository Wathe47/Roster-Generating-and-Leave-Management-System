const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
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

module.exports = Leave;
