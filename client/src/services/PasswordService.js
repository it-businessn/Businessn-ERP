import apiService from "services";

const PasswordService = {
	async updateUserPassword(data, id) {
		return apiService.put(`/user/change-password/${id}`, data, id);
	},
};

export default PasswordService;
