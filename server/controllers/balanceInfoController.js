const { findEmployeePayStub } = require("../helpers/payStubHelper");
const EmployeeBalanceInfo = require("../models/EmployeeBalanceInfo");
const { getPercent, showPercent } = require("../services/util");

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

const getAllBalanceInfo = async (req, res) => {
	const { companyName } = req.params;
	try {
		const result = await EmployeeBalanceInfo.find({
			companyName,
		}).sort({
			createdOn: -1,
		});

		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const getEmployeeBalanceInfo = async (req, res) => {
	const { companyName, empId } = req.params;
	try {
		const result = await findEmployeeBalanceInfo(empId, companyName);
		result.vacationPayPercent = showPercent(result?.vacationPayPercent);

		if (result?.typeOfUnionDuesTreatment?.includes("%")) {
			result.unionDuesContribution = showPercent(result.unionDuesContribution);
		}
		if (result?.typeOfExtendedHealthEETreatment?.includes("%")) {
			result.extendedHealthEEContribution = showPercent(result.extendedHealthEEContribution);
		}
		if (result?.typeOfDentalEETreatment?.includes("%")) {
			result.dentalEEContribution = showPercent(result.dentalEEContribution);
		}
		if (result?.typeOfPensionEETreatment?.includes("%")) {
			result.pensionEEContribution = showPercent(result.pensionEEContribution);
		}
		if (result?.typeOfExtendedHealthERTreatment?.includes("%")) {
			result.extendedHealthERContribution = showPercent(result.extendedHealthERContribution);
		}
		if (result?.typeOfDentalERTreatment?.includes("%")) {
			result.dentalERContribution = showPercent(result.dentalERContribution);
		}
		if (result?.typeOfPensionERTreatment?.includes("%")) {
			result.pensionERContribution = showPercent(result.pensionERContribution);
		}

		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const updateBalanceInfo = async (id, data) =>
	await EmployeeBalanceInfo.findByIdAndUpdate(
		id,
		{ $set: data },
		{
			new: true,
		},
	);

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
			return res.status(201).json(newBalanceInfo);
		}
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

const updateEmployeeBalanceInfo = async (req, res) => {
	const { id } = req.params;
	try {
		// const { empId, companyName } = req.body;
		// const existingBalanceInfo = await findEmployeeBalanceInfo(empId, companyName);
		const existingBalanceInfo = await EmployeeBalanceInfo.findById(id);
		if (!existingBalanceInfo) {
			return res.status(404).json({ message: "Record does not exist" });
		}
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
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error", error });
	}
};

module.exports = {
	getAllBalanceInfo,
	getEmployeeBalanceInfo,
	addEmployeeBalanceInfo,
	updateEmployeeBalanceInfo,
};
