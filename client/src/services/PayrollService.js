import apiService from "services";

const PayrollService = {
	async getAllPaygroups(id) {
		return apiService.get(`/payroll/paygroups/${id}`);
	},
};

export default PayrollService;
