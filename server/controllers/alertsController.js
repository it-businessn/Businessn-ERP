const EmployeeAlertsViolationInfo = require("../models/EmployeeAlertsViolationInfo");

const deleteAlerts = async (empId, type) => {
	const existingAlert = await EmployeeAlertsViolationInfo.deleteMany({
		empId,
		type,
	});
	// const existingAlert = await findAlertInfo({
	// 		empId,
	// 	});
	// 	if (existingAlert) {
	// 		const deleted = await EmployeeAlertsViolationInfo.findByIdAndDelete({
	// 			_id: existingAlert._id,
	// 		});
	// 		if (deleted) {
	// 			console.log(`Alert  with id ${existingAlert._id} deleted successfully.`);
	// 		} else {
	// 			console.log("Alert Details not found.");
	// 		}
	// 	}
};

module.exports = { deleteAlerts };
