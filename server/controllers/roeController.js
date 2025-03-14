const moment = require("moment");
const EmployeeROE = require("../models/EmployeeROE");
const { findEmployeeEmploymentInfo, updateEmploymentInfo } = require("./employmentInfoController");

const findEmployeeROEInfoDetails = async (empId, companyName) =>
	await EmployeeROE.findOne({
		empId,
		companyName,
	});

const getEmployeeROEEmploymentInfo = async (req, res) => {
	const { companyName, empId } = req.params;
	try {
		const existingROEInfo = await findEmployeeROEInfoDetails(empId, companyName);

		return res.status(200).json(existingROEInfo);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

const addEmployeeROEEmploymentInfo = async (req, res) => {
	const {
		empId,
		companyName,
		employmentStartDate,
		employmentLeaveDate,
		finalPayPeriodEndDate,
		reasonCode,
		expectedRecallDate,
		recallDate,
		contactExtNumber,
		contactName,
		contactTelNumber,
		issuerExtNumber,
		issuerName,
		issuerTelNumber,
		preferredCommunication,
	} = req.body;
	try {
		const empTenureInfo = await findEmployeeEmploymentInfo(empId, companyName);
		req.body.updatedOn = moment();
		if (empTenureInfo && employmentStartDate && employmentLeaveDate) {
			await updateEmploymentInfo(empTenureInfo._id, {
				employmentStartDate,
				employmentLeaveDate,
			});
		}
		const existingROEInfo = await findEmployeeROEInfoDetails(empId, companyName);

		if (existingROEInfo) {
			const updatedROEInfo = await EmployeeROE.findByIdAndUpdate(existingROEInfo._id, req.body, {
				new: true,
			});
			return res.status(201).json(updatedROEInfo);
		}
		const newROEInfo = await EmployeeROE.create({
			empId,
			companyName,
			employmentStartDate,
			employmentLeaveDate,
			finalPayPeriodEndDate,
			reasonCode,
			expectedRecallDate,
			recallDate,
			contactExtNumber,
			contactName,
			contactTelNumber,
			issuerExtNumber,
			issuerName,
			issuerTelNumber,
			preferredCommunication,
		});
		return res.status(201).json(newROEInfo);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	getEmployeeROEEmploymentInfo,
	addEmployeeROEEmploymentInfo,
};
