import apiService from "services";

const PasswordService = {
	async updateUserPassword(data, id) {
		return apiService.put(`/change-password/${id}`, data, id);
	},

	async sendPassword(data) {
		return apiService.post(`/forgot-password`, data);
	},
};

export default PasswordService;
