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
	assignee: String,
	originator: String,
	ticketOpenedDate: { type: Date, default: Date.now },
	ticketClosedDate: Date,
	ticketDaysOpened: Number,
	status: { type: String, default: "New" },
	updatedOn: { type: Date, default: Date.now },
	createdOn: { type: Date, default: Date.now },
});

const SupportTicket = mongoose.model("SupportTicket", supportTicketSchema);

module.exports = SupportTicket;
