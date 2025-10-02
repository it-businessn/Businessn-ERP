const Assessment = require("../models/Assessment");
const AssessmentType = require("../models/AssessmentType");

const getAssessment = async (req, res) => {
	const { empId } = req.params;
	try {
		const assessments = await Assessment.find({ empId }).sort({
			createdOn: -1,
		});
		return res.status(200).json(assessments);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const createAssessment = async (req, res) => {
	const { subject, score, category, result, empId, total, companyName } = req.body;

	try {
		const data = {
			subject,
			empId,
			companyName,
		};
		const existingUserAssessment = await Assessment.findOne(data);
		const updatedData = {
			category,
			result,
			score,
		};
		if (existingUserAssessment) {
			const updatedAssessment = await Assessment.findByIdAndUpdate(
				existingUserAssessment._id,
				{ $set: updatedData },
				{ new: true },
			);

			// const ids = [
			// 	"665e405b8a8358e6c1f8f7eb",
			// 	"666a14637e30f273b85e4cc5",
			// ];
			// await Assessment.deleteMany({
			// 	_id: { $in: ids.map((id) => id) },
			// });

			return res.status(201).json(updatedAssessment);
		}
		data.score = score = score;
		data.result = result;
		data.total = total;
		data.category = category;
		const newAssessment = await Assessment.create(data);

		return res.status(201).json(newAssessment);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
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

		return res.status(201).json(assessment);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const deleteAssessmentType = async (req, res) => {
	const { id } = req.params;

	try {
		const assessment = await AssessmentType.findByIdAndDelete({
			_id: id,
		});
		return res.status(201).json(assessment);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const createAssessmentType = async (req, res) => {
	const { name, hasAward, companyName } = req.body;

	try {
		const data = {
			name,
			hasAward,
			companyName,
		};
		const existingRecord = await AssessmentType.findOne(data);
		if (existingRecord) {
			return res.status(409).json({ message: "AssessmentType already exists" });
		}
		const newAssessment = await AssessmentType.create(data);

		return res.status(201).json(newAssessment);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getAssessmentType = async (req, res) => {
	const { companyName } = req.params;
	try {
		const assessments = await AssessmentType.find({ companyName });
		return res.status(200).json(assessments);
	} catch (error) {
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
