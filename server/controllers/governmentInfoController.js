const EmployeeGovernmentInfo = require("../models/EmployeeGovernmentInfo");

const getAllGovernmentInfo = async (req, res) => {
	const { companyName } = req.params;
	try {
		const result = await EmployeeGovernmentInfo.find({
			companyName,
		}).sort({
			createdOn: -1,
		});

		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getEmployeeGovernmentInfo = async (req, res) => {
	const { companyName, empId } = req.params;
	try {
		const result = await findEmployeeGovernmentInfo(empId, companyName);
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const findEmployeeGovernmentInfo = async (empId, companyName) =>
	await EmployeeGovernmentInfo.findOne({
		empId,
		companyName,
	});

const updateGovernmentInfo = async (id, data) =>
	await EmployeeGovernmentInfo.findByIdAndUpdate(id, data, {
		new: true,
	});

const addEmployeeGovernmentInfo = async (req, res) => {
	const {
		empId,
		isCPPExempt,
		isEIExempt,
		companyName,
		federalTax,
		regionalTax,
		federalTaxCredit,
		regionalTaxCredit,
		federalPensionEE,
		federalPensionER,
		federalEmploymentInsuranceEE,
		federalEmploymentInsuranceER,
		regionalEmployeeInjury,
		regionalEmployeeHealth,
		regionalEmployerInjury,
		regionalEmployerHealth,
	} = req.body;
	try {
		const existingGovernmentInfo = await findEmployeeGovernmentInfo(empId, companyName);
		if (existingGovernmentInfo) {
			const updatedGovernmentInfo = await updateGovernmentInfo(
				existingGovernmentInfo._id,
				req.body,
			);
			return res.status(201).json(updatedGovernmentInfo);
		}
		const newGovernmentInfo = await EmployeeGovernmentInfo.create({
			empId,
			isCPPExempt,
			isEIExempt,
			companyName,
			federalTax,
			regionalTax,
			federalTaxCredit,
			regionalTaxCredit,
			federalPensionEE,
			federalPensionER,
			federalEmploymentInsuranceEE,
			federalEmploymentInsuranceER,
			regionalEmployeeInjury,
			regionalEmployeeHealth,
			regionalEmployerInjury,
			regionalEmployerHealth,
		});
		return res.status(201).json(newGovernmentInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateEmployeeGovernmentInfo = async (req, res) => {
	const { id } = req.params;
	try {
		if (req.body?._id) delete req.body._id;
		const updatedInfo = await updateGovernmentInfo(id, req.body);
		res.status(201).json(updatedInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const findEmployeeGovernmentInfoDetails = async (empId, companyName) =>
	await EmployeeGovernmentInfo.findOne({
		empId,
		companyName,
	}).select("empId federalTaxCredit regionalTaxCredit isCPPExempt isEIExempt");

module.exports = {
	findEmployeeGovernmentInfoDetails,
	getAllGovernmentInfo,
	getEmployeeGovernmentInfo,
	addEmployeeGovernmentInfo,
	updateEmployeeGovernmentInfo,
};
