import apiService from "services";

const PayrollService = {
	async getAllPaygroups(id) {
		return apiService.get(`/payroll/paygroups/${id}`);
	},

	async getEmployeePayInfo(company, empId) {
		return apiService.get(`/payroll/payInfo/${company}/${empId}`);
	},
};

export default PayrollService;
