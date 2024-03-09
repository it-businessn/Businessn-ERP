const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
	contactId: { type: mongoose.Schema.Types.ObjectId, ref: "Contact" },
	date: { type: Date, default: Date.now },
	dueDate: Date,
	name: String,
	status: String,
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
