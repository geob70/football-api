const mongoose = require("mongoose");

const fixtureSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  teamA: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  teamB: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  time: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
});

module.exports = mongoose.model("Fixture", fixtureSchema);
