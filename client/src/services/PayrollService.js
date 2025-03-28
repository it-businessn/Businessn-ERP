import apiService from "services";

const PayrollService = {
	async getAllPaygroups(id) {
		return apiService.get(`/payroll/payGroups/${id}`);
	},

	async getAllEmployeePayInfo(company, payDate, isExtraRun, groupId) {
		return apiService.get(`/payroll/payInfo/${company}/${payDate}/${isExtraRun}/${groupId}`);
	},

	async getAllEmployeeAmountInfo(company, payDate, extraRun, groupId, payrunOption, deptName) {
		return apiService.get(
			`/payroll/additionalAllocation/${company}/${payDate}/${extraRun}/${groupId}/${payrunOption}/${deptName}`,
		);
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
		deptName,
	) {
		return apiService.get(
			`/payroll/employmentInfo/${company}/${startDate}/${endDate}/${payDate}/${isExtraRun}/${groupId}/${deptName}`,
		);
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

	async getHoursWorkedAllocationByType(
		company,
		startDate,
		endDate,
		payDate,
		isExtraRun,
		groupId,
		payrunOption,
		deptName,
	) {
		return apiService.get(
			`/payroll/hoursTimesheet/${company}/${startDate}/${endDate}/${payDate}/${isExtraRun}/${groupId}/${payrunOption}/${deptName}`,
		);
	},

	async getEEContribution(
		company,
		startDate,
		endDate,
		payDate,
		isExtraRun,
		groupId,
		payrunOption,
		deptName,
	) {
		return apiService.get(
			`/payroll/EEContribution/${company}/${startDate}/${endDate}/${payDate}/${isExtraRun}/${groupId}/${payrunOption}/${deptName}`,
		);
	},

	async getERContribution(
		company,
		startDate,
		endDate,
		payDate,
		isExtraRun,
		groupId,
		payrunOption,
		deptName,
	) {
		return apiService.get(
			`/payroll/ERContribution/${company}/${startDate}/${endDate}/${payDate}/${isExtraRun}/${groupId}/${payrunOption}/${deptName}`,
		);
	},

	async getEmpPayReportDetails(company, empId) {
		return apiService.get(`/payroll/payDetailsReport/${company}/${empId}`);
	},

	async getPayReportDetails(company, payNum, isExtraRun, year) {
		return apiService.get(`/payroll/payDetailsReport/${company}/${payNum}/${isExtraRun}/${year}`);
	},

	async getTotalFundingPayReportDetails(company, payNum, isExtraRun) {
		return apiService.get(
			`/payroll/payDetailsReport/funds/report/${company}/${payNum}/${isExtraRun}`,
		);
	},

	async getTotalsPayReportDetails(company, payNum, isExtraRun) {
		return apiService.get(
			`/payroll/payDetailsReport/funds/totals/${company}/${payNum}/${isExtraRun}`,
		);
	},

	async addPayPeriodPayStub(data) {
		return apiService.post("/payroll/payDetailsReport", data);
	},

	async getTotalAlerts(company, payNum) {
		return apiService.get(`/payroll/total-alerts/${company}/${payNum}`);
	},

	async getAlertsDetails(company, payNum) {
		return apiService.get(`/payroll/alertsReport/${company}/${payNum}`);
	},

	async addAlertsAndViolations(data) {
		return apiService.post("/payroll/generate-alerts", data);
	},
};

export default PayrollService;
