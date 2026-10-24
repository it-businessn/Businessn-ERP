const Contact = require("../models/Contact");
const { sendTemplate, contactFollowUpEmail } = require("../services/emailTemplates");
const { companyScopeFilter } = require("../middleware/authorize");
const { pickScalarFields } = require("../helpers/requestFields");

// NEW-12: fields of the "Add contact" form (client AddContact.jsx).
const CONTACT_FORM_FIELDS = [
	"companyAddress",
	"companyName",
	"email",
	"employees",
	"firstName",
	"industryType",
	"lastName",
	"phone",
	"primaryContactAddress",
	"revenue",
];

const getContacts = async (req, res) => {
	try {
		// NEW-06: was Contact.find({}) — every tenant's contacts.
		const contacts = await Contact.find(await companyScopeFilter(req)).populate("leadId");
		res.json(contacts);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getContact = async (req, res) => {
	const { id, companyName } = req.params;

	try {
		const contact = await Contact.findOne({
			$or: [
				{ _id: id, companyName },
				{ leadId: id, companyName },
			],
		}).populate("leadId");
		return res.status(200).json(contact);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getOnboardedCompanyContact = async (req, res) => {
	const { companyName } = req.params;

	try {
		const contacts = await Contact.find({ companyName })
			.populate({
				path: "leadId",
				match: { stage: "T4" },
			})
			.select("leadId");
		const filteredContacts = contacts.filter((contact) => contact?.leadId);
		return res.status(200).json(filteredContacts);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getCompanyContact = async (req, res) => {
	const { companyName } = req.params;

	try {
		const contact = await Contact.find({ companyName }).populate("leadId");
		return res.status(200).json(contact);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const createContact = async (req, res) => {
	const {
		companyAddress,
		companyName,
		email,
		employees,
		firstName,
		industryType,
		lastName,
		phone,
		primaryContactAddress,
		revenue,
	} = req.body;

	try {
		// NEW-12: the duplicate check used the raw body as the filter, so operator
		// objects ({"$ne": null}) or unknown keys reached Mongo. Only the form fields
		// (AddContact.jsx) are used, and they must be plain values.
		const { data: filter, invalid } = pickScalarFields(req.body, CONTACT_FORM_FIELDS);
		if (invalid.length > 0) {
			return res.status(400).json({ message: `Invalid value for: ${invalid.join(", ")}` });
		}
		const existData = await Contact.findOne(filter);
		if (existData) {
			return res.status(409).json({ message: "Contact already exists" });
		}
		const data = {
			companyAddress,
			companyName,
			date: Date.now(),
			email,
			employees,
			firstName,
			industryType,
			lastName,
			phone,
			primaryContactAddress,
			revenue,
		};
		const newContact = await Contact.create(data);
		return res.status(201).json(newContact);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const updateContact = async (req, res) => {
	// API-13: the route is PUT /:id; reading req.params.contactId gave undefined,
	// so the update matched nothing and returned 201 with null.
	const { id: contactId } = req.params;

	try {
		const updatedContact = await Contact.findByIdAndUpdate(
			contactId,
			{ $set: req.body },
			{ new: true },
		);

		return res.status(201).json(updatedContact);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const followUpContact = async (req, res) => {
	const { contactEmail } = req.body;
	try {
		await sendTemplate(contactEmail, contactFollowUpEmail({ firstName: req.body?.firstName }));

		return res.status(200).json({
			message: "A followup email has been sent to your email address!",
		});
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

module.exports = {
	createContact,
	getContact,
	getContacts,
	updateContact,
	getCompanyContact,
	followUpContact,
	getOnboardedCompanyContact,
};
