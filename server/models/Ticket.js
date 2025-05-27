const mongoose = require("mongoose");
const { TICKET_STATUS } = require("../services/data");

const supportTicketSchema = new mongoose.Schema({
	file: {
		data: Buffer,
		contentType: String,
		path: String,
	},
	originalname: String,
	companyName: String,
	clientId: String,
	clientFirstName: String,
	clientLastName: String,
	clientEmail: String,
	clientPhoneNumber: String,
	clientModeOfContact: String,
	inquiryType: String,
	topic: String,
	issue: String,
	ticketNumber: String,
	category: String,
	priority: { type: String, default: "low" },
	assignee: { type: String, ref: "Employee" },
	originator: { type: String, ref: "Employee" },
	ticketClosedDate: Date,
	ticketDaysOpened: { type: Number, default: 0 },
	status: { type: String, default: TICKET_STATUS.OPEN },
	updatedOn: { type: Date, default: Date.now },
	createdOn: { type: Date, default: Date.now },
});

const SupportTicket = mongoose.model("SupportTicket", supportTicketSchema);

module.exports = SupportTicket;
