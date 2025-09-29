const Form = require("../models/Form");

const createForm = () => async (req, res) => {
	const data = {
		field1: req.body.field1,
		field2: req.body.field2,
	};

	try {
		const existingRecord = await Form.findOne(data);
		if (existingRecord) {
			return res.status(409).json({ message: "Form already exists" });
		}
		const newForm = await Form.create(data);
		return res.status(201).json(newForm);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

module.exports = { createForm };
