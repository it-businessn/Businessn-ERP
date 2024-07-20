const EmployeeBalanceInfo = require("../models/EmployeeBalanceInfo");

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

const findEmployeeBalanceInfo = async (empId, companyName) =>
	await EmployeeBalanceInfo.findOne({
		empId,
		companyName,
	});

const updateBalanceInfo = async (id, data) =>
	await EmployeeBalanceInfo.findByIdAndUpdate(id, data, {
		new: true,
	});

const addEmployeeBalanceInfo = async (req, res) => {
	const {
		empId,
		companyName,
		vacationAvailableBalance,
		availableStartOFYear,
		accruedBalance,
		usedBalance,
		regPayHoursYTD,
		overTimePayHoursYTD,
		dblOverTimePayHoursYTD,
		statWorkPayHoursYTD,
		statPayHoursYTD,
		sickPayHoursYTD,
		vacationPayHoursYTD,
		regPayDollarsYTD,
		overTimePayDollarsYTD,
		dblOverTimePayDollarsYTD,
		statWorkPayDollarsYTD,
		statPayDollarsYTD,
		sickPayDollarsYTD,
		vacationDollarsYTD,
		longTermDisabilityEE_YTD,
		dentalEE_YTD,
		extendedHealthEE_YTD,
		unionDuesYTD,
		longTermDisabilityER_YTD,
		dentalER_YTD,
		extendedHealthER_YTD,
	} = req.body;
	try {
		const existingBalanceInfo = await findEmployeeBalanceInfo(
			empId,
			companyName,
		);
		if (existingBalanceInfo) {
			const updatedBalanceInfo = await updateBalanceInfo(
				existingBalanceInfo._id,
				req.body,
			);
			return res.status(201).json(updatedBalanceInfo);
		}
		const newBalanceInfo = await EmployeeBalanceInfo.create({
			empId,
			companyName,
			vacationAvailableBalance,
			availableStartOFYear,
			accruedBalance,
			usedBalance,
			regPayHoursYTD,
			overTimePayHoursYTD,
			dblOverTimePayHoursYTD,
			statWorkPayHoursYTD,
			statPayHoursYTD,
			sickPayHoursYTD,
			vacationPayHoursYTD,
			regPayDollarsYTD,
			overTimePayDollarsYTD,
			dblOverTimePayDollarsYTD,
			statWorkPayDollarsYTD,
			statPayDollarsYTD,
			sickPayDollarsYTD,
			vacationDollarsYTD,
			longTermDisabilityEE_YTD,
			dentalEE_YTD,
			extendedHealthEE_YTD,
			unionDuesYTD,
			longTermDisabilityER_YTD,
			dentalER_YTD,
			extendedHealthER_YTD,
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
