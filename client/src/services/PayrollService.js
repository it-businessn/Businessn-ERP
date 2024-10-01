import apiService from "services";

const PayrollService = {
	async getAllPaygroups(id) {
		return apiService.get(`/payroll/payGroups/${id}`);
	},

	async getAllEmployeePayInfo(company, payDate, isExtraRun, groupId) {
		return apiService.get(
			`/payroll/payInfo/${company}/${payDate}/${isExtraRun}/${groupId}`,
		);
	},

	async updateEmployeeAmountAllocation(data, id) {
		return apiService.put(`/payroll/amountAllocation/${id}`, data, id);
	},

	async updateEmployeePayInfo(data, id) {
		return apiService.put(`/payroll/payInfo/${id}`, data, id);
	},

	async getEmployeePayInfo(company, empId) {
		return apiService.get(`/payroll/payInfo/detail/${company}/${empId}`);
	},

	async addEmployeePayInfo(data) {
		return apiService.post("/payroll/payInfo", data);
	},

	async getEmployeeProfileInfo(company, empId) {
		return apiService.get(`/payroll/profileInfo/${company}/${empId}`);
	},

	async addEmployeeProfileInfo(data) {
		return apiService.post("/payroll/profileInfo", data);
	},

	async getAllEmployeeEmploymentInfo(
		company,
		startDate,
		endDate,
		payDate,
		isExtraRun,
		groupId,
	) {
		return apiService.get(
			`/payroll/employmentInfo/${company}/${startDate}/${endDate}/${payDate}/${isExtraRun}/${groupId}`,
		);
	},

	async getEmployeeEmploymentInfo(company, empId) {
		return apiService.get(`/payroll/employmentInfo/${company}/${empId}`);
	},

	async addEmployeeEmploymentInfo(data) {
		return apiService.post("/payroll/employmentInfo", data);
	},

	async getEmployeeGovernmentInfo(company, empId) {
		return apiService.get(`/payroll/governmentInfo/${company}/${empId}`);
	},

	async addEmployeeGovernmentInfo(data) {
		return apiService.post("/payroll/governmentInfo", data);
	},

	async getEmployeeBankingInfo(company, empId) {
		return apiService.get(`/payroll/bankingInfo/${company}/${empId}`);
	},

	async addEmployeeBankingInfo(data) {
		return apiService.post("/payroll/bankingInfo", data);
	},

	async getEmployeeBalanceInfo(company, empId) {
		return apiService.get(`/payroll/balanceInfo/${company}/${empId}`);
	},

	async addEmployeeBalanceInfo(data) {
		return apiService.post("/payroll/balanceInfo", data);
	},

	async getHoursWorkedAllocation(
		company,
		startDate,
		endDate,
		payDate,
		isExtraRun,
		groupId,
	) {
		return apiService.get(
			`/payroll/hoursTimesheet/${company}/${startDate}/${endDate}/${payDate}/${isExtraRun}/${groupId}`,
		);
	},

	async getEmpPayReportDetails(company, empId) {
		return apiService.get(`/payroll/payDetailsReport/${company}/${empId}`);
	},

	async getPayReportDetails(company, payNum, isExtraRun) {
		return apiService.get(
			`/payroll/payDetailsReport/${company}/${payNum}/${isExtraRun}`,
		);
	},

	async getAlertsDetails(company, payNum) {
		return apiService.get(`/payroll/alertsReport/${company}/${payNum}`);
	},

	async addPayPeriodPayStub(data) {
		return apiService.post("/payroll/generate-payStub", data);
	},

	async addAlertsAndViolations(data) {
		return apiService.post("/payroll/generate-alerts", data);
	},
};

export default PayrollService;
