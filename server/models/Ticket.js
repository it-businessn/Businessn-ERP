const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema({
	companyName: String,
	clientId: String,
	clientFirstName: String,
	clientLastName: String,
	clientEmail: String,
	clientPhoneNumber: String,
	clientModeOfContact: String,
	inquiryType: String,
	issue: String,
	ticketNumber: String,
	category: String,
	priority: { type: Number, default: 1 },
	assignee: { type: String, ref: "Employee" },
	originator: { type: String, ref: "Employee" },
	ticketClosedDate: Date,
	ticketDaysOpened: { type: Number, default: 0 },
	status: { type: String, default: "In Progress" },
	updatedOn: { type: Date, default: Date.now },
	createdOn: { type: Date, default: Date.now },
});

const SupportTicket = mongoose.model("SupportTicket", supportTicketSchema);

module.exports = SupportTicket;
