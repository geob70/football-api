const mongoose = require("mongoose");

const teamSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, unique: true, required: true },
  location: { type: String, unique: true, required: true },
});

module.exports = mongoose.model("Team", teamSchema);
