const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
	contactId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Contact",
	},
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
	description: String,
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	companyName: { type: String, ref: "Company" },
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
