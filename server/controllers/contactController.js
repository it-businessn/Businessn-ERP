const Contact = require("../models/Contact");

const getContacts = async (req, res) => {
	try {
		const contacts = await Contact.find({}).populate("leadId");
		res.json(contacts);
	} catch (error) {
		res.status(500).json({ message: error.message });
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
		res.status(200).json(contact);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getCompanyContact = async (req, res) => {
	const { companyName } = req.params;

	try {
		const contact = await Contact.find({ companyName }).populate("leadId");
		res.status(200).json(contact);
	} catch (error) {
		res.status(404).json({ error: error.message });
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
		const newContact = await Contact.create({
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
		});
		res.status(201).json(newContact);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateContact = async (req, res) => {
	const contactId = req.params.id;

	try {
		const updatedContact = await Contact.findByIdAndUpdate(
			contactId,
			req.body,
			{ new: true },
		);

		res.status(201).json(updatedContact);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	createContact,
	getContact,
	getContacts,
	updateContact,
	getCompanyContact,
};
