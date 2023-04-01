let Roster = require("../models/roster");

exports.getRoster = (req, res) => {
  Roster.find()
    .then((roster) => res.json(roster))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.getRosterById = (req, res) => {
  Roster.findById(req.params.id)
    .then((roster) => res.json(roster))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.addRosterItem = (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const checkedIn = req.body.checkedIn;

  const newRoster = new Roster({
    name,
    email,
    checkedIn,
  });

  newRoster
    .save()
    .then(() => res.json("Roster item added!"))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.updateRosterItem = (req, res) => {
  Roster.findById(req.params.id)
    .then((roster) => {
      roster.name = req.body.name;
      roster.email = req.body.email;
      roster.checkedIn = req.body.checkedIn;
      roster
        .save()
        .then(() => res.json("Roster item updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.deleteRosterItem = (req, res) => {
  Roster.findByIdAndDelete(req.params.id)
    .then(() => res.json("Roster item deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
};
