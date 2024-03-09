const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
	contactId: { type: mongoose.Schema.Types.ObjectId, ref: "Contact" },
	date: { type: Date, default: Date.now },
	description: String,
});

const Note = mongoose.model("Notes", noteSchema);

module.exports = Note;
