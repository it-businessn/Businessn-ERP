const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
	// contactId: { type: mongoose.Schema.Types.ObjectId, ref: "Contact" },
	projectName: String,
	taskName: String,
	selectedAssignees: Object,
	hasChecklist: Boolean,
	todoItems: Object,
	date: { type: Date, default: Date.now },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
