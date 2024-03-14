const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
	// contactId: { type: mongoose.Schema.Types.ObjectId, ref: "Contact" },
	// date: { type: Date, default: Date.now },
	// description: String,
	content: String,
	created_at: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
