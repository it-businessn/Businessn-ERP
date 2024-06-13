import apiService from "services";

const PayoutService = {
	async getPayouts(id) {
		return apiService.get(`/payouts/${id}`);
	},

	async addPayout(data) {
		return apiService.post("/payouts", data);
	},

	async updatePayout(data, id) {
		return apiService.put(`/payouts/${id}`, data, id);
	},
};

export default PayoutService;
