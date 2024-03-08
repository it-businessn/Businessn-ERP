const Contact = require("../models/Contact");

const getContacts = async (req, res) => {
	try {
		const contacts = await Contact.find({}).sort({ date: -1 });
		res.json(contacts);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getContactById = async (req, res) => {
	const id = req.params.id;

	try {
		const notes = (await Contact.find({ contactId: id })).sort(
			(a, b) => b.date - a.date,
		);
		res.status(200).json(notes);
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

	const contact = new Contact({
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

	try {
		const newContact = await contact.save();
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
	getContactById,
	getContacts,
	updateContact,
};
