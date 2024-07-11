const Assessment = require("../models/Assessment");
const AssessmentType = require("../models/AssessmentType");

const getAssessment = async (req, res) => {
	const { empId } = req.params;
	try {
		const assessments = (await Assessment.find({ empId })).sort(
			(a, b) => b.createdOn - a.createdOn,
		);
		res.status(200).json(assessments);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const createAssessment = async (req, res) => {
	const { subject, score, category, result, empId, total, companyName } =
		req.body;

	try {
		const existingUserAssessment = await Assessment.findOne({
			subject,
			empId,
			companyName,
		});

		if (existingUserAssessment) {
			const updatedData = {
				category,
				result,
				score,
			};
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

			res.status(201).json(updatedAssessment);
		} else {
			const newAssessment = await Assessment.create({
				subject,
				score,
				category,
				result,
				empId,
				total,
				companyName,
			});

			res.status(201).json(newAssessment);
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
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

const deleteAssessmentType = async (req, res) => {
	const { id } = req.params;

	try {
		const assessment = await AssessmentType.findByIdAndDelete({
			_id: id,
		});
		res.status(201).json(assessment);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const createAssessmentType = async (req, res) => {
	const { name, hasAward, companyName } = req.body;

	try {
		const newAssessment = await AssessmentType.create({
			name,
			hasAward,
			companyName,
		});

		res.status(201).json(newAssessment);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const getAssessmentType = async (req, res) => {
	const { companyName } = req.params;
	try {
		const assessments = await AssessmentType.find({ companyName });
		res.status(200).json(assessments);
	} catch (error) {
		res.status(404).json({ error: error.message });
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
