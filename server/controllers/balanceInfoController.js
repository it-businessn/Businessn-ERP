const EmployeeBalanceInfo = require("../models/EmployeeBalanceInfo");
const EmployeePayStub = require("../models/EmployeePayStub");

const getAllBalanceInfo = async (req, res) => {
	const { companyName } = req.params;
	try {
		const result = await EmployeeBalanceInfo.find({
			companyName,
		}).sort({
			createdOn: -1,
		});

		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getEmployeeBalanceInfo = async (req, res) => {
	const { companyName, empId } = req.params;
	try {
		const result = await findEmployeeBalanceInfo(empId, companyName);

		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const findEmployeeBalanceInfo = async (empId, companyName, isUpdate) => {
	const empBalanceInfo = await EmployeeBalanceInfo.findOne({
		empId,
		companyName,
	});

	if (isUpdate) {
		return empBalanceInfo;
	}
	const empPayStub = await findEmployeePayStub(empId, companyName);

	return {
		typeOfVacationTreatment: empBalanceInfo?.typeOfVacationTreatment || null,
		vacationPayPercent: empBalanceInfo?.vacationPayPercent || null,
		carryFwd: empBalanceInfo?.carryFwd || false,
		empPayStub: empPayStub[0],
	};
};

const findEmployeePayStub = async (empId, companyName) =>
	await EmployeePayStub.aggregate([
		{
			$match: { empId, companyName },
		},
		{ $sort: { _id: -1 } },
		{ $limit: 1 },
	]);

const updateBalanceInfo = async (id, data) =>
	await EmployeeBalanceInfo.findByIdAndUpdate(id, data, {
		new: true,
	});

const addEmployeeBalanceInfo = async (req, res) => {
	const { empId, companyName, carryFwd, typeOfVacationTreatment, vacationPayPercent } = req.body;
	try {
		let newVacationPayPercent = vacationPayPercent ? parseFloat(vacationPayPercent) : 0;
		const existingBalanceInfo = await findEmployeeBalanceInfo(empId, companyName, true);
		if (existingBalanceInfo) {
			const updatedBalanceInfo = await updateBalanceInfo(existingBalanceInfo._id, req.body);
			return res.status(201).json(updatedBalanceInfo);
		}
		const newBalanceInfo = await EmployeeBalanceInfo.create({
			empId,
			companyName,
			carryFwd,
			typeOfVacationTreatment,
			vacationPayPercent:
				newVacationPayPercent > 1 ? newVacationPayPercent / 100 : newVacationPayPercent,
		});
		return res.status(201).json(newBalanceInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateEmployeeBalanceInfo = async (req, res) => {
	const { id } = req.params;
	try {
		const updatedInfo = await updateBalanceInfo(id, req.body);
		res.status(201).json(updatedInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	getAllBalanceInfo,
	getEmployeeBalanceInfo,
	addEmployeeBalanceInfo,
	updateEmployeeBalanceInfo,
};
