const mongoose = require("mongoose");

const rosterSchema = new mongoose.Schema(
  {
    monday: {
      holiday: {
        type: Boolean,
        default: false,
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
    tuesday: {
      holiday: {
        type: Boolean,
        default: false,
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
    wednesday: {
      holiday: {
        type: Boolean,
        default: false,
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
    thursday: {
      holiday: {
        type: Boolean,
        default: false,
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
    friday: {
      holiday: {
        type: Boolean,
        default: false,
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
  },
  {
    timestamps: true,
  }
);

const Roster = mongoose.model("Roster", rosterSchema);

module.exports = Roster;
