const { findEmployeePayStub } = require("../helpers/payStubHelper");
const EmployeeBalanceInfo = require("../models/EmployeeBalanceInfo");
const { showPercent, isPercentType, normalizePercent } = require("../services/util");

const findEmployeeBalanceInfo = async (empId, companyName, isUpdate) => {
	try {
		if (!empId || !companyName) {
			console.warn("⚠️ Missing params in findEmployeeBalanceInfo", {
				empId,
				companyName,
			});
			return null;
		}

		const empBalanceInfo = await EmployeeBalanceInfo.findOne({
			empId,
			companyName,
		});

		if (!empBalanceInfo) {
			console.warn("⚠️ No balance info found", {
				empId,
				companyName,
			});
			return null;
		}

		if (isUpdate) {
			return empBalanceInfo;
		}

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
		};
	} catch (error) {
		console.error("❌ findEmployeeBalanceInfo ERROR", {
			message: error.message,
			stack: error.stack,
			empId,
			companyName,
		});
		throw error;
	}
};

const getAllBalanceInfo = async (req, res) => {
	const { companyName } = req.params;
	try {
		if (!companyName) {
			return res.status(400).json({ message: "companyName is required" });
		}

		const result = await EmployeeBalanceInfo.find({ companyName }).sort({
			createdOn: -1,
		});

		// console.log("✅ Balance info fetched", {
		// 	companyName,
		// 	count: result.length,
		// });

		return res.status(200).json(result);
	} catch (error) {
		console.error("❌ getAllBalanceInfo ERROR", {
			message: error.message,
			stack: error.stack,
			params: req.params,
		});

		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

const getEmployeeBalanceInfo = async (req, res) => {
	const start = Date.now();
	const { companyName, empId, payPeriodPayDate } = req.params;
	try {
		if (!companyName || !empId) {
			return res.status(400).json({ message: "companyName and empId required" });
		}

		const result = await findEmployeeBalanceInfo(empId, companyName);
		const empPayStub = await findEmployeePayStub(empId, payPeriodPayDate, companyName);

		if (!result) {
			console.warn("⚠️ Balance info not found", { empId, companyName });
			return res.status(404).json({ message: "Balance info not found" });
		}
		const formatted = { ...result };

		formatted.vacationPayPercent = showPercent(formatted.vacationPayPercent);

		if (isPercentType(formatted.typeOfUnionDuesTreatment)) {
			formatted.unionDuesContribution = showPercent(formatted.unionDuesContribution);
		}
		if (isPercentType(formatted.typeOfExtendedHealthEETreatment)) {
			formatted.extendedHealthEEContribution = showPercent(formatted.extendedHealthEEContribution);
		}
		if (isPercentType(formatted.typeOfDentalEETreatment)) {
			formatted.dentalEEContribution = showPercent(formatted.dentalEEContribution);
		}
		if (isPercentType(formatted.typeOfPensionEETreatment)) {
			formatted.pensionEEContribution = showPercent(formatted.pensionEEContribution);
		}
		if (isPercentType(formatted.typeOfExtendedHealthERTreatment)) {
			formatted.extendedHealthERContribution = showPercent(formatted.extendedHealthERContribution);
		}
		if (isPercentType(formatted.typeOfDentalERTreatment)) {
			formatted.dentalERContribution = showPercent(formatted.dentalERContribution);
		}
		if (isPercentType(formatted.typeOfPensionERTreatment)) {
			formatted.pensionERContribution = showPercent(formatted.pensionERContribution);
		}

		formatted.empPayStub = empPayStub;
		// console.log("✅ Balance info fetched", {
		// 	empId,
		// 	companyName,
		// 	timeMs: Date.now() - start,
		// });

		return res.status(200).json(formatted);
	} catch (error) {
		console.error("❌ getEmployeeBalanceInfo ERROR", {
			message: error.message,
			stack: error.stack,
			params: req.params,
		});

		return res.status(500).json({
			message: "Internal Server Error",
		});
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
			vacationPayPercent: normalizePercent(vacationPayPercent),
			typeOfUnionDuesTreatment,
			unionDuesContribution: isPercentType(typeOfUnionDuesTreatment)
				? normalizePercent(unionDuesContribution)
				: unionDuesContribution || 0,
			typeOfExtendedHealthEETreatment,
			extendedHealthEEContribution: isPercentType(typeOfExtendedHealthEETreatment)
				? normalizePercent(extendedHealthEEContribution)
				: extendedHealthEEContribution || 0,
			typeOfDentalEETreatment,
			dentalEEContribution: isPercentType(typeOfDentalEETreatment)
				? normalizePercent(dentalEEContribution)
				: dentalEEContribution || 0,
			typeOfPensionEETreatment,
			pensionEEContribution: isPercentType(typeOfPensionEETreatment)
				? normalizePercent(pensionEEContribution)
				: pensionEEContribution || 0,
			typeOfExtendedHealthERTreatment,
			extendedHealthERContribution: isPercentType(typeOfExtendedHealthERTreatment)
				? normalizePercent(extendedHealthERContribution)
				: extendedHealthERContribution || 0,
			typeOfDentalERTreatment,
			dentalERContribution: isPercentType(typeOfDentalERTreatment)
				? normalizePercent(dentalERContribution)
				: dentalERContribution || 0,
			typeOfPensionERTreatment,
			pensionERContribution: isPercentType(typeOfPensionERTreatment)
				? normalizePercent(pensionERContribution)
				: pensionERContribution || 0,
		};

		const existing = await findEmployeeBalanceInfo(empId, companyName, true);
		let result;
		if (existing) {
			// result = await updateBalanceInfo(existing._id, data);
		} else {
			result = await EmployeeBalanceInfo.create(data);
		}
		return res.status(201).json(result);
	} catch (error) {
		console.error("❌ addEmployeeBalanceInfo ERROR", {
			message: error.message,
			stack: error.stack,
			body: req.body,
		});

		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

const updateEmployeeBalanceInfo = async (req, res) => {
	const { id } = req.params;
	try {
		// const { empId, companyName } = req.body;
		// const existingBalanceInfo = await findEmployeeBalanceInfo(empId, companyName);
		const existing = await EmployeeBalanceInfo.findById(id);
		if (!existing) {
			return res.status(404).json({ message: "Record does not exist" });
		}

		const { _id, ...updateData } = req.body;

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
		} = updateData;
		const data = {
			empId,
			companyName,
			// carryFwd,
			typeOfVacationTreatment,
			vacationPayPercent: normalizePercent(vacationPayPercent),
			typeOfUnionDuesTreatment,
			unionDuesContribution: isPercentType(typeOfUnionDuesTreatment)
				? normalizePercent(unionDuesContribution)
				: unionDuesContribution || 0,
			typeOfExtendedHealthEETreatment,
			extendedHealthEEContribution: isPercentType(typeOfExtendedHealthEETreatment)
				? normalizePercent(extendedHealthEEContribution)
				: extendedHealthEEContribution || 0,
			typeOfDentalEETreatment,
			dentalEEContribution: isPercentType(typeOfDentalEETreatment)
				? normalizePercent(dentalEEContribution)
				: dentalEEContribution || 0,
			typeOfPensionEETreatment,
			pensionEEContribution: isPercentType(typeOfPensionEETreatment)
				? normalizePercent(pensionEEContribution)
				: pensionEEContribution || 0,
			typeOfExtendedHealthERTreatment,
			extendedHealthERContribution: isPercentType(typeOfExtendedHealthERTreatment)
				? normalizePercent(extendedHealthERContribution)
				: extendedHealthERContribution || 0,
			typeOfDentalERTreatment,
			dentalERContribution: isPercentType(typeOfDentalERTreatment)
				? normalizePercent(dentalERContribution)
				: dentalERContribution || 0,
			typeOfPensionERTreatment,
			pensionERContribution: isPercentType(typeOfPensionERTreatment)
				? normalizePercent(pensionERContribution)
				: pensionERContribution || 0,
		};

		const updatedInfo = await updateBalanceInfo(id, data);
		return res.status(201).json(updatedInfo);
	} catch (error) {
		console.error("❌ updateEmployeeBalanceInfo ERROR", {
			message: error.message,
			stack: error.stack,
			body: req.body,
		});
		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

module.exports = {
	getAllBalanceInfo,
	getEmployeeBalanceInfo,
	addEmployeeBalanceInfo,
	updateEmployeeBalanceInfo,
};
