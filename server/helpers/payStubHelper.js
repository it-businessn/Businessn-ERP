const EmployeePayStub = require("../models/EmployeePayStub");

const { getSumTotal } = require("../services/payrollService");

const findEmployeePayStub = async (empId, payPeriodPayDate, companyName) =>
	await EmployeePayStub.findOne({
		empId,
		payPeriodPayDate: { $lt: new Date(payPeriodPayDate) },
		companyName,
	}).sort({
		payPeriodProcessingDate: -1,
	});

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

const appendPrevPayInfoBalance = (prevPayPayInfo, newPayStub) => {
	const {
		YTDCommission,
		YTDRetroactive,
		YTDVacationPayout,
		YTDBonus,
		YTDTerminationPayout,
		YTDRegHoursWorked,
		YTDOvertimeHoursWorked,
		YTDDblOvertimeHoursWorked,
		YTDStatDayHoursWorked,
		YTDStatHoursWorked,
		YTDSickHoursWorked,
		YTDVacationHoursWorked,
		YTDBereavementHoursWorked,
		YTDPersonalDayHoursWorked,
		YTDSprayHoursWorked,
		YTDFirstAidHoursWorked,
		YTDRegPayTotal,
		YTDRegPayTotal2,
		YTDOverTimePayTotal,
		YTDDblOverTimePayTotal,
		YTDStatWorkPayTotal,
		YTDStatPayTotal,
		YTDSickPayTotal,
		YTDVacationPayTotal,
		YTDBereavementPayTotal,
		YTDPersonalDayPayTotal,
		YTD_FDTaxDeductions,
		YTDStateTaxDeductions,
		YTD_IncomeTaxDeductions,
		YTD_EmployeeEIDeductions,
		YTD_EmployerEIDeductions,
		YTD_EmployerCPPDeductions,
		YTD_CPPDeductions,
		YTDUnionDuesDeductions,
		YTDEmployeeHealthContributions,
		YTDEmployeePensionContributions,
		YTDEmployerPensionContributions,
		YTDEmployerHealthContributions,
		YTDEmployerContributions,
		YTDVacationAccrued,
		YTDVacationUsed,
		YTDVacationBalanceFwd,
		YTDVacationBalance,
		YTDSprayPayTotal,
		YTDFirstAidPayTotal,
		YTDPayInLieuPay,
		YTDBenefitPay,
		YTDBankedTimePay,
		YTDRegularByAmount,
		YTDPrimaryDeposit,
		YTDOtherDeductions,
		YTDGrossPay,
		YTDDeductionsTotal,
		YTDNetPay,
		YTDSickAccrued,
		YTDSickUsed,
		YTDSickBalance,
	} = newPayStub;
	if (!prevPayPayInfo) {
		prevPayPayInfo = {};
	}
	prevPayPayInfo.YTDCommission = getSumTotal(prevPayPayInfo.YTDCommission, YTDCommission);
	prevPayPayInfo.YTDRetroactive = getSumTotal(prevPayPayInfo.YTDRetroactive, YTDRetroactive);
	prevPayPayInfo.YTDVacationPayout = getSumTotal(
		prevPayPayInfo.YTDVacationPayout,
		YTDVacationPayout,
	);
	prevPayPayInfo.YTDBonus = getSumTotal(prevPayPayInfo.YTDBonus, YTDBonus);
	prevPayPayInfo.YTDTerminationPayout = getSumTotal(
		prevPayPayInfo.YTDTerminationPayout,
		YTDTerminationPayout,
	);
	prevPayPayInfo.YTDRegHoursWorked = getSumTotal(
		prevPayPayInfo.YTDRegHoursWorked,
		YTDRegHoursWorked,
	);
	prevPayPayInfo.YTDOvertimeHoursWorked = getSumTotal(
		prevPayPayInfo.YTDOvertimeHoursWorked,
		YTDOvertimeHoursWorked,
	);
	prevPayPayInfo.YTDDblOvertimeHoursWorked = getSumTotal(
		prevPayPayInfo.YTDDblOvertimeHoursWorked,
		YTDDblOvertimeHoursWorked,
	);
	prevPayPayInfo.YTDStatDayHoursWorked = getSumTotal(
		prevPayPayInfo.YTDStatDayHoursWorked,
		YTDStatDayHoursWorked,
	);
	prevPayPayInfo.YTDStatHoursWorked = getSumTotal(
		prevPayPayInfo.YTDStatHoursWorked,
		YTDStatHoursWorked,
	);
	prevPayPayInfo.YTDSickHoursWorked = getSumTotal(
		prevPayPayInfo.YTDSickHoursWorked,
		YTDSickHoursWorked,
	);
	prevPayPayInfo.YTDVacationHoursWorked = getSumTotal(
		prevPayPayInfo.YTDVacationHoursWorked,
		YTDVacationHoursWorked,
	);
	prevPayPayInfo.YTDBereavementHoursWorked = getSumTotal(
		prevPayPayInfo.YTDBereavementHoursWorked,
		YTDBereavementHoursWorked,
	);
	prevPayPayInfo.YTDPersonalDayHoursWorked = getSumTotal(
		prevPayPayInfo.YTDPersonalDayHoursWorked,
		YTDPersonalDayHoursWorked,
	);
	prevPayPayInfo.YTDSprayHoursWorked = getSumTotal(
		prevPayPayInfo.YTDSprayHoursWorked,
		YTDSprayHoursWorked,
	);
	prevPayPayInfo.YTDFirstAidHoursWorked = getSumTotal(
		prevPayPayInfo.YTDFirstAidHoursWorked,
		YTDFirstAidHoursWorked,
	);

	prevPayPayInfo.YTDRegPayTotal = getSumTotal(prevPayPayInfo.YTDRegPayTotal, YTDRegPayTotal);
	prevPayPayInfo.YTDRegPayTotal2 = getSumTotal(prevPayPayInfo.YTDRegPayTotal, YTDRegPayTotal2);
	prevPayPayInfo.YTDOverTimePayTotal = getSumTotal(
		prevPayPayInfo.YTDOverTimePayTotal,
		YTDOverTimePayTotal,
	);
	prevPayPayInfo.YTDDblOverTimePayTotal = getSumTotal(
		prevPayPayInfo.YTDDblOverTimePayTotal,
		YTDDblOverTimePayTotal,
	);
	prevPayPayInfo.YTDStatWorkPayTotal = getSumTotal(
		prevPayPayInfo.YTDStatWorkPayTotal,
		YTDStatWorkPayTotal,
	);
	prevPayPayInfo.YTDStatPayTotal = getSumTotal(prevPayPayInfo.YTDStatPayTotal, YTDStatPayTotal);
	prevPayPayInfo.YTDSickPayTotal = getSumTotal(prevPayPayInfo.YTDSickPayTotal, YTDSickPayTotal);
	prevPayPayInfo.YTDVacationPayTotal = getSumTotal(
		prevPayPayInfo.YTDVacationPayTotal,
		YTDVacationPayTotal,
	);
	prevPayPayInfo.YTDBereavementPayTotal = getSumTotal(
		prevPayPayInfo.YTDBereavementPayTotal,
		YTDBereavementPayTotal,
	);
	prevPayPayInfo.YTDPersonalDayPayTotal = getSumTotal(
		prevPayPayInfo.YTDPersonalDayPayTotal,
		YTDPersonalDayPayTotal,
	);

	prevPayPayInfo.YTD_FDTaxDeductions = getSumTotal(
		prevPayPayInfo.YTD_FDTaxDeductions,
		YTD_FDTaxDeductions,
	);
	prevPayPayInfo.YTDStateTaxDeductions = getSumTotal(
		prevPayPayInfo.YTDStateTaxDeductions,
		YTDStateTaxDeductions,
	);
	prevPayPayInfo.YTD_IncomeTaxDeductions = getSumTotal(
		prevPayPayInfo.YTD_IncomeTaxDeductions,
		YTD_IncomeTaxDeductions,
	);
	prevPayPayInfo.YTD_EmployeeEIDeductions = getSumTotal(
		prevPayPayInfo.YTD_EmployeeEIDeductions,
		YTD_EmployeeEIDeductions,
	);
	prevPayPayInfo.YTD_EmployerEIDeductions = getSumTotal(
		prevPayPayInfo.YTD_EmployerEIDeductions,
		YTD_EmployerEIDeductions,
	);
	prevPayPayInfo.YTD_EmployerCPPDeductions = getSumTotal(
		prevPayPayInfo.YTD_EmployerCPPDeductions,
		YTD_EmployerCPPDeductions,
	);
	prevPayPayInfo.YTD_CPPDeductions = getSumTotal(
		prevPayPayInfo.YTD_CPPDeductions,
		YTD_CPPDeductions,
	);
	prevPayPayInfo.YTDUnionDuesDeductions = getSumTotal(
		prevPayPayInfo.YTDUnionDuesDeductions,
		YTDUnionDuesDeductions,
	);
	prevPayPayInfo.YTDEmployeeHealthContributions = getSumTotal(
		prevPayPayInfo.YTDEmployeeHealthContributions,
		YTDEmployeeHealthContributions,
	);
	prevPayPayInfo.YTDEmployeePensionContributions = getSumTotal(
		prevPayPayInfo.YTDEmployeePensionContributions,
		YTDEmployeePensionContributions,
	);
	prevPayPayInfo.YTDEmployerPensionContributions = getSumTotal(
		prevPayPayInfo.YTDEmployerPensionContributions,
		YTDEmployerPensionContributions,
	);
	prevPayPayInfo.YTDEmployerHealthContributions = getSumTotal(
		prevPayPayInfo.YTDEmployerHealthContributions,
		YTDEmployerHealthContributions,
	);
	prevPayPayInfo.YTDEmployerContributions = getSumTotal(
		prevPayPayInfo.YTDEmployerContributions,
		YTDEmployerContributions,
	);
	// prevPayPayInfo.YTDVacationAccrued = getSumTotal(
	// 	prevPayPayInfo.YTDVacationAccrued,
	// 	YTDVacationAccrued,
	// );
	prevPayPayInfo.YTDVacationAccrued = YTDVacationAccrued;
	prevPayPayInfo.YTDVacationUsed = getSumTotal(prevPayPayInfo.YTDVacationUsed, YTDVacationUsed);
	prevPayPayInfo.YTDVacationBalanceFwd = getSumTotal(
		prevPayPayInfo.YTDVacationBalanceFwd,
		YTDVacationBalanceFwd,
	);
	prevPayPayInfo.YTDVacationBalance = getSumTotal(
		prevPayPayInfo.YTDVacationBalance,
		YTDVacationBalance,
	);
	prevPayPayInfo.YTDSprayPayTotal = getSumTotal(prevPayPayInfo.YTDSprayPayTotal, YTDSprayPayTotal);
	prevPayPayInfo.YTDFirstAidPayTotal = getSumTotal(
		prevPayPayInfo.YTDFirstAidPayTotal,
		YTDFirstAidPayTotal,
	);
	prevPayPayInfo.YTDPayInLieuPay = getSumTotal(prevPayPayInfo.YTDPayInLieuPay, YTDPayInLieuPay);
	prevPayPayInfo.YTDBenefitPay = getSumTotal(prevPayPayInfo.YTDBenefitPay, YTDBenefitPay);
	prevPayPayInfo.YTDBankedTimePay = getSumTotal(prevPayPayInfo.YTDBankedTimePay, YTDBankedTimePay);
	prevPayPayInfo.YTDRegularByAmount = getSumTotal(
		prevPayPayInfo.YTDRegularByAmount,
		YTDRegularByAmount,
	);
	prevPayPayInfo.YTDPrimaryDeposit = getSumTotal(
		prevPayPayInfo.YTDPrimaryDeposit,
		YTDPrimaryDeposit,
	);
	prevPayPayInfo.YTDOtherDeductions = getSumTotal(
		prevPayPayInfo.YTDOtherDeductions,
		YTDOtherDeductions,
	);
	prevPayPayInfo.YTDGrossPay = getSumTotal(prevPayPayInfo.YTDGrossPay, YTDGrossPay);
	prevPayPayInfo.YTDDeductionsTotal = getSumTotal(
		prevPayPayInfo.YTDDeductionsTotal,
		YTDDeductionsTotal,
	);
	prevPayPayInfo.YTDNetPay = getSumTotal(prevPayPayInfo.YTDNetPay, YTDNetPay);
	prevPayPayInfo.YTDSickAccrued = getSumTotal(prevPayPayInfo.YTDSickAccrued, YTDSickAccrued);
	prevPayPayInfo.YTDSickUsed = getSumTotal(prevPayPayInfo.YTDSickUsed, YTDSickUsed);
	prevPayPayInfo.YTDSickBalance = getSumTotal(prevPayPayInfo.YTDSickBalance, YTDSickBalance);
	return prevPayPayInfo;
};

module.exports = { findEmployeePayStub, findEmpPayStubDetail, appendPrevPayInfoBalance };
