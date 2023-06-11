const mongoose = require("mongoose");

const rosterSchema = new mongoose.Schema(
  {
    monday: {
      date: {
        type: Date,
      },
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
      date: {
        type: Date,
      },
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
      date: {
        type: Date,
      },
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
      date: {
        type: Date,
      },
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
      date: {
        type: Date,
      },
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
