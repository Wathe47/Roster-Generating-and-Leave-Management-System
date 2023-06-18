let Roster = require("../models/roster");

exports.getRoster = (req, res) => {
  const { email } = req.query;

  Roster.find({ email })
    .then((roster) => res.json(roster))
    .catch((err) => res.status(400).json("Error: " + err));
};


exports.getRosterById = (req, res) => {
  Roster.findById(req.params.id)
    .then((roster) => res.json(roster))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.addRosterItem = (req, res) => {
  const { name, email, checkedIn } = req.body;

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
  const { id } = req.params;
  const { checkedIn } = req.body;
  const currentTime = new Date().toISOString();

  Roster.findByIdAndUpdate(
    id,
    {
      checkedIn,
      checkOutTime: checkedIn ? currentTime : null,
    },
    { new: true }
  )
    .then(() => res.json("Roster item updated!"))
    .catch((err) => res.status(400).json("Error: " + err));
};


exports.deleteRosterItem = (req, res) => {
  Roster.findByIdAndDelete(req.params.id)
    .then(() => res.json("Roster item deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
};