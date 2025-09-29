const Contact = require("../models/Contact");
const { sendEmail } = require("../services/emailService");

const getContacts = async (req, res) => {
	try {
		const contacts = await Contact.find({}).populate("leadId");
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
		const existData = await Contact.findOne(req.body);
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
	const { contactId } = req.params;

	try {
		const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

		return res.status(201).json(updatedContact);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const followUpContact = async (req, res) => {
	const { contactEmail } = req.body;
	try {
		await sendEmail(
			contactEmail,
			"Thank you for contacting us",
			"We have received your inquiry. An agent will get in touch with you shortly to discuss your interests and provide more information.",
		);

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
