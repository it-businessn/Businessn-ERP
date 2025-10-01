const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
	{
		contactId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Contact",
		},
		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
		description: String,
		companyName: { type: String, ref: "Company" },
	},
	{ timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } },
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
