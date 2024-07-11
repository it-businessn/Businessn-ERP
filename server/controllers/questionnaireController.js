const Questionnaire = require("../models/Questionnaire");

const getQuestionnaires = async (req, res) => {
	try {
		const questionnaires = await Questionnaire.find({}).sort({ createdOn: -1 });
		res.status(200).json(questionnaires);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getQuestionnaire = async (req, res) => {
	const { contactId } = req.params;

	try {
		const notes = (await Questionnaire.find({ contactId })).sort(
			(a, b) => b.date - a.date,
		);
		res.status(200).json(notes);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createQuestionnaire = async (req, res) => {
	const {
		assessmentType,
		company,
		correctAnswer,
		explanation,
		options,
		question,
	} = req.body;

	try {
		const newQuestionnaire = await Questionnaire.create({
			correctAnswer,
			explanation,
			options,
			question,
			subject: assessmentType,
			companyName: company,
		});
		res.status(201).json(newQuestionnaire);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateQuestionnaire = async (req, res) => {
	const { id } = req.params;
	try {
		const updatedContact = await Questionnaire.findByIdAndUpdate(id, req.body, {
			new: true,
		});

		res.status(201).json(updatedContact);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const deleteQuestionnaire = async (req, res) => {
	const { id } = req.params;
	try {
		const updatedContact = await Questionnaire.findByIdAndDelete(id, req.body, {
			new: true,
		});

		res.status(201).json(updatedContact);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const getSubjectQuestionnaire = async (req, res) => {
	const { subject, companyName } = req.params;

	try {
		const questions = await Questionnaire.find({
			subject,
			companyName,
		});
		res.status(200).json(questions);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

module.exports = {
	createQuestionnaire,
	getQuestionnaire,
	getQuestionnaires,
	updateQuestionnaire,
	deleteQuestionnaire,
	getSubjectQuestionnaire,
};
