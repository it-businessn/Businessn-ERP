const Form = require("../models/Form");

const createForm = () => async (req, res) => {
	const form = new Form({
		field1: req.body.field1,
		field2: req.body.field2,
	});

	try {
		const newForm = await form.save();
		res.status(201).json(newForm);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = { createForm };
