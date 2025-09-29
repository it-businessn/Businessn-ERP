const Questionnaire = require("../models/Questionnaire");

const getQuestionnaires = async (req, res) => {
	try {
		const questionnaires = await Questionnaire.find({}).sort({ createdOn: -1 });
		return res.status(200).json(questionnaires);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getQuestionnaire = async (req, res) => {
	const { contactId } = req.params;

	try {
		const notes = await Questionnaire.find({ contactId }).sort({
			createdOn: -1,
		});
		return res.status(200).json(notes);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const createQuestionnaire = async (req, res) => {
	const { assessmentType, company, correctAnswer, explanation, options, question } = req.body;
	const data = {
		correctAnswer,
		explanation,
		options,
		question,
		subject: assessmentType,
		companyName: company,
	};
	try {
		const existingRecord = await Questionnaire.findOne(data);
		if (existingRecord) {
			return res.status(409).json({ message: "Questionnaire already exists" });
		}
		const newQuestionnaire = await Questionnaire.create(data);
		return res.status(201).json(newQuestionnaire);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const updateQuestionnaire = async (req, res) => {
	const { id } = req.params;
	try {
		const updatedContact = await Questionnaire.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		return res.status(201).json(updatedContact);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const deleteQuestionnaire = async (req, res) => {
	const { id } = req.params;
	try {
		const updatedContact = await Questionnaire.findByIdAndDelete(id, req.body, {
			new: true,
		});
		return res.status(201).json(updatedContact);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getSubjectQuestionnaire = async (req, res) => {
	const { subject, companyName } = req.params;

	try {
		const questions = await Questionnaire.find({
			subject,
			companyName,
		});
		return res.status(200).json(questions);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
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
