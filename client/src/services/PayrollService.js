import apiService from "services";

const PayrollService = {
	async getAllPaygroups(id) {
		return apiService.get(`/payroll/paygroups/${id}`);
	},

	async getAllEmployeePayInfo(company) {
		return apiService.get(`/payroll/payInfo/${company}`);
	},

	async updateEmployeePayInfo(data, id) {
		return apiService.put(`/payroll/payInfo/${id}`, data, id);
	},

	async getEmployeePayInfo(company, empId) {
		return apiService.get(`/payroll/payInfo/${company}/${empId}`);
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

	async getAllEmployeeEmploymentInfo(company) {
		return apiService.get(`/payroll/employmentInfo/${company}`);
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
};

export default PayrollService;
