import apiService from "services";

const PayrollService = {
	async getAllPaygroups(id) {
		return apiService.get(`/payroll/payGroups/${id}`);
	},

	async getAllEmployeePayInfo(company, payDate, isExtraRun, groupId) {
		return apiService.get(`/payroll/payInfo/${company}/${payDate}/${isExtraRun}/${groupId}`);
	},

	async getAllEmployeeAmountInfo(data) {
		return apiService.post(`/payroll/additionalAllocation`, data);
	},

	async getEmployeeROEEmploymentInfo(company, empId) {
		return apiService.get(`/payroll/roe/${company}/${empId}`);
	},

	async getEmpEarningInfo(company, empId) {
		return apiService.get(`/payroll/roe/earnings/${company}/${empId}`);
	},

	async addAdditionalHoursAllocation(data) {
		return apiService.post("/payroll/additionalAllocation/hours", data);
	},

	async addEmployeeExtraAmount(data) {
		return apiService.post(`/payroll/additionalAllocation/amount`, data);
	},

	async addEmployeeContribution(data) {
		return apiService.post(`/payroll/additionalAllocation/ee-contr`, data);
	},

	async addEmployerContribution(data) {
		return apiService.post(`/payroll/additionalAllocation/er-contr`, data);
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

	async getEmpProfileUsers(company) {
		return apiService.get(`/payroll/profileInfo/${company}`);
	},

	async getEmployeeProfileInfo(company, empId) {
		return apiService.get(`/payroll/profileInfo/${company}/${empId}`);
	},

	async addEmployeeProfileInfo(data) {
		return apiService.post("/payroll/profileInfo", data);
	},

	async onboardUser(data) {
		return apiService.post("/payroll/profileInfo/onboard", data);
	},

	async updateEmployeeProfileInfo(data, id) {
		return apiService.put(`/payroll/profileInfo/${id}`, data, id);
	},

	async getAllEmployeeEmploymentInfo(data) {
		return apiService.post(`/payroll/employmentInfo/details`, data);
	},

	async getEmployeeEmploymentInfo(company, empId) {
		return apiService.get(`/payroll/employmentInfo/${company}/${empId}`);
	},

	async addEmployeeROEEmploymentInfo(data) {
		return apiService.post("/payroll/roe", data);
	},

	async addEmployeeEmploymentInfo(data) {
		return apiService.post("/payroll/employmentInfo", data);
	},

	async updateEmployeeEmploymentInfo(data, id) {
		return apiService.put(`/payroll/employmentInfo/${id}`, data, id);
	},

	async getEmployeeGovernmentInfo(company, empId) {
		return apiService.get(`/payroll/governmentInfo/${company}/${empId}`);
	},

	async addEmployeeGovernmentInfo(data) {
		return apiService.post("/payroll/governmentInfo", data);
	},

	async updateEmployeeGovernmentInfo(data, id) {
		return apiService.put(`/payroll/governmentInfo/${id}`, data, id);
	},

	async getEmployeeBankingInfo(company, empId) {
		return apiService.get(`/payroll/bankingInfo/${company}/${empId}`);
	},

	async addEmployeeBankingInfo(data) {
		return apiService.post("/payroll/bankingInfo", data);
	},

	async updateEmployeeBankingInfo(data, id) {
		return apiService.put(`/payroll/bankingInfo/${id}`, data, id);
	},

	async getEmployeeBalanceInfo(company, empId) {
		return apiService.get(`/payroll/balanceInfo/${company}/${empId}`);
	},

	async addEmployeeBalanceInfo(data) {
		return apiService.post("/payroll/balanceInfo", data);
	},

	async updateEmployeeBalanceInfo(data, id) {
		return apiService.put(`/payroll/balanceInfo/${id}`, data, id);
	},

	async getHoursWorkedAllocationByType(data) {
		return apiService.post(`/payroll/hoursTimesheet/`, data);
	},

	async getEEContribution(data) {
		return apiService.post(`/payroll/EEContribution`, data);
	},

	async getERContribution(data) {
		return apiService.post(`/payroll/ERContribution`, data);
	},

	async getEmpPayReportDetails(company, empId) {
		return apiService.get(`/payroll/payDetailsReport/${company}/${empId}`);
	},

	async getPayReportDetails(company, payNum, isExtraRun, payPeriodPayDate, frequency, year) {
		return apiService.get(
			`/payroll/payDetailsReport/${company}/${payNum}/${isExtraRun}/${payPeriodPayDate}/${frequency}/${year}`,
		);
	},

	async getTotalFundingPayReportDetails(company, payNum, isExtraRun, frequency) {
		return apiService.get(
			`/payroll/payDetailsReport/funds/report/${company}/${payNum}/${isExtraRun}/${frequency}`,
		);
	},

	async getTotalsPayReportDetails(company, payNum, isExtraRun, frequency) {
		return apiService.get(
			`/payroll/payDetailsReport/funds/totals/${company}/${payNum}/${isExtraRun}/${frequency}`,
		);
	},

	async getJournalEntryReportDetails(company, payNum, isExtraRun, frequency) {
		return apiService.get(
			`/payroll/payDetailsReport/funds/journals/${company}/${payNum}/${isExtraRun}/${frequency}`,
		);
	},

	async addPayPeriodPayStub(data) {
		return apiService.post("/payroll/payDetailsReport", data);
	},

	async getTotalAlerts(company, payNum) {
		return apiService.get(`/payroll/total-alerts/${company}/${payNum}`);
	},

	async getAlertsDetails(company, payNum, selectedPayGroup) {
		return apiService.get(`/payroll/alertsReport/${company}/${payNum}/${selectedPayGroup}`);
	},

	async addAlertsAndViolations(data) {
		return apiService.post("/payroll/generate-alerts", data);
	},
};

export default PayrollService;
