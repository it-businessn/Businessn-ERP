const Questionnaire = require("../models/Questionnaire");
const Assessment = require("../models/Assessment");
const AssessmentType = require("../models/AssessmentType");

const getAllQuestions = async (req, res) => {
	try {
		const questionnaires = await Questionnaire.find({}).sort({ createdOn: -1 });
		res.status(200).json(questionnaires);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getQuestionById = async (req, res) => {
	const id = req.params.id;

	try {
		const notes = (await Questionnaire.find({ contactId: id })).sort(
			(a, b) => b.date - a.date,
		);
		res.status(200).json(notes);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const getAssessmentQuestionsByType = async (req, res) => {
	const { id } = req.params;
	try {
		const questions = await Questionnaire.find({ subject: id });
		res.status(200).json(questions);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};
const getAssessmentType = async (req, res) => {
	try {
		const assessments = await AssessmentType.find({});
		res.status(200).json(assessments);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};
const getAssessmentByUserId = async (req, res) => {
	const { id } = req.params;
	try {
		const assessments = (await Assessment.find({ empId: id })).sort(
			(a, b) => b.createdOn - a.createdOn,
		);
		res.status(200).json(assessments);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const updateAssessment = async (req, res) => {
	const { id } = req.params;
	try {
		const assessment = await Assessment.findByIdAndUpdate(id, req.body, {
			new: true,
		});

		res.status(201).json(assessment);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const createAssessmentType = async (req, res) => {
	const { name } = req.body;

	try {
		const assessment = new AssessmentType({
			name,
		});

		const newAssessment = await assessment.save();
		res.status(201).json(newAssessment);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
const createAssessment = async (req, res) => {
	const { subject, score, category, result, empId, total } = req.body;

	try {
		const assessment = new Assessment({
			subject,
			score,
			category,
			result,
			empId,
			total,
		});

		const newAssessment = await assessment.save();
		res.status(201).json(newAssessment);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const createQuestionnaire = async (req, res) => {
	const { assessmentType, correctAnswer, explanation, options, question } =
		req.body;

	try {
		const questionnaire = new Questionnaire({
			correctAnswer,
			explanation,
			options,
			question,
			subject: assessmentType,
		});

		const newQuestionnaire = await questionnaire.save();
		res.status(201).json(newQuestionnaire);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateQuestionnaireById = async (req, res) => {
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

module.exports = {
	createQuestionnaire,
	getQuestionById,
	getAllQuestions,
	updateQuestionnaireById,
	createAssessment,
	getAssessmentByUserId,
	updateAssessment,
	getAssessmentType,
	createAssessmentType,
	getAssessmentQuestionsByType,
};