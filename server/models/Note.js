const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: "Contact" },
  description: String,
  date: { type: Date, default: Date.now },
});

const Note = mongoose.model("Notes", noteSchema);

module.exports = Note;
