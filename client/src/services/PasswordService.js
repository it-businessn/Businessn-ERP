import apiService from "services";

const PasswordService = {
	async updateUserPassword(data, id) {
		return apiService.put(`/user/change-password/${id}`, data, id);
	},

	async sendPassword(data) {
		return apiService.post(`/user/forgot-password`, data);
	},
};

export default PasswordService;
