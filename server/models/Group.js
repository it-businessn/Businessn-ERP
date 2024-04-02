const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
	name: String,
	createdOn: { type: Date, default: Date.now },
	isActive: { type: Boolean, default: false },
	members: [{ type: Object, ref: "Employee" }],
	admin: [{ type: String, ref: "Employee" }],
	modules: [{ type: String, ref: "Module" }],
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
