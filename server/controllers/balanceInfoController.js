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
		_id: empBalanceInfo?._id,
		empId: empBalanceInfo?.empId,
		typeOfVacationTreatment: empBalanceInfo?.typeOfVacationTreatment,
		vacationPayPercent: empBalanceInfo?.vacationPayPercent,
		carryFwd: empBalanceInfo?.carryFwd,
		typeOfUnionDuesTreatment: empBalanceInfo?.typeOfUnionDuesTreatment,
		unionDuesContribution: empBalanceInfo?.unionDuesContribution,
		typeOfExtendedHealthEETreatment: empBalanceInfo?.typeOfExtendedHealthEETreatment,
		extendedHealthEEContribution: empBalanceInfo?.extendedHealthEEContribution,
		typeOfDentalEETreatment: empBalanceInfo?.typeOfDentalEETreatment,
		dentalEEContribution: empBalanceInfo?.dentalEEContribution,
		typeOfPensionEETreatment: empBalanceInfo?.typeOfPensionEETreatment,
		pensionEEContribution: empBalanceInfo?.pensionEEContribution,
		typeOfExtendedHealthERTreatment: empBalanceInfo?.typeOfExtendedHealthERTreatment,
		extendedHealthERContribution: empBalanceInfo?.extendedHealthERContribution,
		typeOfDentalERTreatment: empBalanceInfo?.typeOfDentalERTreatment,
		dentalERContribution: empBalanceInfo?.dentalERContribution,
		typeOfPensionERTreatment: empBalanceInfo?.typeOfPensionERTreatment,
		pensionERContribution: empBalanceInfo?.pensionERContribution,
		empPayStub,
	};
};

const findEmployeePayStub = async (empId, companyName) =>
	await EmployeePayStub.findOne({ empId, companyName }).sort({ payPeriodProcessingDate: -1 });

const updateBalanceInfo = async (id, data) =>
	await EmployeeBalanceInfo.findByIdAndUpdate(id, data, {
		new: true,
	});

const getPercent = (value) => {
	const input = value === "" ? 0 : parseFloat(value);
	// return input;
	return Number.isInteger(input) ? input / 100 : input;
};
const addEmployeeBalanceInfo = async (req, res) => {
	const {
		empId,
		companyName,
		carryFwd,
		typeOfVacationTreatment,
		vacationPayPercent,
		typeOfUnionDuesTreatment,
		unionDuesContribution,
		typeOfExtendedHealthEETreatment,
		extendedHealthEEContribution,
		typeOfDentalEETreatment,
		dentalEEContribution,
		typeOfPensionEETreatment,
		pensionEEContribution,
		typeOfExtendedHealthERTreatment,
		extendedHealthERContribution,
		typeOfDentalERTreatment,
		dentalERContribution,
		typeOfPensionERTreatment,
		pensionERContribution,
	} = req.body;
	try {
		const data = {
			empId,
			companyName,
			carryFwd,
			typeOfVacationTreatment,
			vacationPayPercent: getPercent(vacationPayPercent),
			typeOfUnionDuesTreatment,
			unionDuesContribution: typeOfUnionDuesTreatment?.includes("%")
				? getPercent(unionDuesContribution)
				: unionDuesContribution || 0,
			typeOfExtendedHealthEETreatment,
			extendedHealthEEContribution: typeOfExtendedHealthEETreatment?.includes("%")
				? getPercent(extendedHealthEEContribution)
				: extendedHealthEEContribution || 0,
			typeOfDentalEETreatment,
			dentalEEContribution: typeOfDentalEETreatment?.includes("%")
				? getPercent(dentalEEContribution)
				: dentalEEContribution || 0,
			typeOfPensionEETreatment,
			pensionEEContribution: typeOfPensionEETreatment?.includes("%")
				? getPercent(pensionEEContribution)
				: pensionEEContribution || 0,
			typeOfExtendedHealthERTreatment,
			extendedHealthERContribution: typeOfExtendedHealthERTreatment?.includes("%")
				? getPercent(extendedHealthERContribution)
				: extendedHealthERContribution || 0,
			typeOfDentalERTreatment,
			dentalERContribution: typeOfDentalERTreatment?.includes("%")
				? getPercent(dentalERContribution)
				: dentalERContribution || 0,
			typeOfPensionERTreatment,
			pensionERContribution: typeOfPensionERTreatment?.includes("%")
				? getPercent(pensionERContribution)
				: pensionERContribution || 0,
		};
		const existingBalanceInfo = await findEmployeeBalanceInfo(empId, companyName, true);
		// if (existingBalanceInfo) {
		// 	const updatedBalanceInfo = await updateBalanceInfo(existingBalanceInfo._id, data);
		// 	return res.status(201).json(updatedBalanceInfo);
		// }
		if (!existingBalanceInfo) {
			const newBalanceInfo = await EmployeeBalanceInfo.create(data);
			res.status(201).json(newBalanceInfo);
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateEmployeeBalanceInfo = async (req, res) => {
	const { id } = req.params;
	try {
		// const { empId, companyName } = req.body;
		// const existingBalanceInfo = await findEmployeeBalanceInfo(empId, companyName);
		const existingBalanceInfo = await EmployeeBalanceInfo.findById(id);
		if (existingBalanceInfo) {
			if (req.body?._id) delete req.body._id;
			const {
				empId,
				companyName,
				carryFwd,
				typeOfVacationTreatment,
				vacationPayPercent,
				typeOfUnionDuesTreatment,
				unionDuesContribution,
				typeOfExtendedHealthEETreatment,
				extendedHealthEEContribution,
				typeOfDentalEETreatment,
				dentalEEContribution,
				typeOfPensionEETreatment,
				pensionEEContribution,
				typeOfExtendedHealthERTreatment,
				extendedHealthERContribution,
				typeOfDentalERTreatment,
				dentalERContribution,
				typeOfPensionERTreatment,
				pensionERContribution,
			} = req.body;
			const data = {
				empId,
				companyName,
				// carryFwd,
				typeOfVacationTreatment,
				vacationPayPercent: getPercent(vacationPayPercent),
				typeOfUnionDuesTreatment,
				unionDuesContribution: typeOfUnionDuesTreatment?.includes("%")
					? getPercent(unionDuesContribution)
					: unionDuesContribution || 0,
				typeOfExtendedHealthEETreatment,
				extendedHealthEEContribution: typeOfExtendedHealthEETreatment?.includes("%")
					? getPercent(extendedHealthEEContribution)
					: extendedHealthEEContribution || 0,
				typeOfDentalEETreatment,
				dentalEEContribution: typeOfDentalEETreatment?.includes("%")
					? getPercent(dentalEEContribution)
					: dentalEEContribution || 0,
				typeOfPensionEETreatment,
				pensionEEContribution: typeOfPensionEETreatment?.includes("%")
					? getPercent(pensionEEContribution)
					: pensionEEContribution || 0,
				typeOfExtendedHealthERTreatment,
				extendedHealthERContribution: typeOfExtendedHealthERTreatment?.includes("%")
					? getPercent(extendedHealthERContribution)
					: extendedHealthERContribution || 0,
				typeOfDentalERTreatment,
				dentalERContribution: typeOfDentalERTreatment?.includes("%")
					? getPercent(dentalERContribution)
					: dentalERContribution || 0,
				typeOfPensionERTreatment,
				pensionERContribution: typeOfPensionERTreatment?.includes("%")
					? getPercent(pensionERContribution)
					: pensionERContribution || 0,
			};
			const updatedInfo = await updateBalanceInfo(id, data);
			return res.status(201).json(updatedInfo);
		}
		return res.status(201).json("Record does not exist");
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
