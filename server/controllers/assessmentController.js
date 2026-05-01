const Assessment = require("../models/Assessment");
const AssessmentType = require("../models/AssessmentType");

const getAssessment = async (req, res) => {
	const { empId } = req.params;
	try {
		const assessments = await Assessment.find({ empId })
			.sort({
				createdOn: -1,
			})
			.lean();
		return res.status(200).json(assessments);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const createAssessment = async (req, res) => {
	const { subject, score, category, result, empId, total, companyName } = req.body;

	try {
		const newAssessment = await Assessment.findOneAndUpdate(
			{ subject, empId, companyName },
			{ score, category, result, total },
			{ new: true, upsert: true },
		);

		return res.status(201).json(newAssessment);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

const updateAssessment = async (req, res) => {
	const { id } = req.params;
	try {
		const assessment = await Assessment.findByIdAndUpdate(
			id,
			{ $set: req.body },
			{
				new: true,
			},
		);
		if (!assessment) {
			return res.status(404).json({ message: "Assessment not found" });
		}

		return res.status(201).json(assessment);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const deleteAssessmentType = async (req, res) => {
	const { id } = req.params;

	try {
		const assessment = await AssessmentType.findByIdAndDelete(id);
		if (!assessment) {
			return res.status(404).json({ message: "AssessmentType not found" });
		}
		return res.status(201).json(assessment);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const createAssessmentType = async (req, res) => {
	const { name, hasAward, companyName } = req.body;

	try {
		const assessment = await AssessmentType.findOneAndUpdate(
			{ name, hasAward, companyName },
			{ new: true, upsert: true },
		);

		return res.status(201).json(assessment);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getAssessmentType = async (req, res) => {
	const { companyName } = req.params;
	try {
		const assessments = await AssessmentType.find({ companyName });
		return res.status(200).json(assessments);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

module.exports = {
	createAssessment,
	getAssessment,
	updateAssessment,
	getAssessmentType,
	createAssessmentType,
	deleteAssessmentType,
};
