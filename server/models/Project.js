const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
	// contactId: { type: mongoose.Schema.Types.ObjectId, ref: "Contact" },
	date: { type: Date, default: Date.now },
	hasChecklist: Boolean,
	projectName: String,
	selectedAssignees: Object,
	taskName: String,
	todoItems: Object,
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
