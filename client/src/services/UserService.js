import apiService from "services";

const UserService = {
	async updateUserProfile(data, id) {
		return apiService.put(`/user/${id}`, data, id);
	},

	async updateUserById(data, id, token) {
		return apiService.put(`/employee/${id}`, data, id, token);
	},
};

export default UserService;
