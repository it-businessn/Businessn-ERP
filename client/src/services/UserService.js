import apiService from "services";

const UserService = {
	async updateUserProfile(data, id) {
		return apiService.put(`/user/${id}`, data, id);
	},

	async updateUserById(data, id, token) {
		return apiService.put(`/employee/${id}`, data, id, token);
	},

	async updateUserAssignedLeads(data, id) {
		return apiService.put(`/user/lead/${id}`, data, id);
	},

	async getAllUsers() {
		return apiService.get(`/user`);
	},

	async signUp(data) {
		return apiService.post("/user/register", data);
	},

	async verifyUser(data) {
		return apiService.post("/user/verify-email", data);
	},
};

export default UserService;
