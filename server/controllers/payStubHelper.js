const findEmpPayStubDetail = async (empId, payPeriodPayDate, companyName) =>
	await EmployeePayStub.findOne({
		empId,
		payPeriodPayDate,
		companyName,
	})
		.populate({
			path: "empId",
			model: "Employee",
			select: "fullName",
		})
		.select("commission retroactive reimbursement vacationPayout bonus terminationPayout");

module.exports = { findEmpPayStubDetail };
