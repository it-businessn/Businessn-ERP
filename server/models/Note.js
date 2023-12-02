const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  description: String,
  date: { type: Date, default: Date.now },
});

const Note = mongoose.model("Notes", noteSchema);

module.exports = Note;
