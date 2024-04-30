import apiService from "services";

const UserService = {
	async updateUserProfile(data, id) {
		return apiService.put(`/user/${id}`, data, id);
	},

	async updateUserById(data, id, token) {
		return apiService.put(`/employee/${id}`, data, id, token);
	},

	async updateUserInfoById(data, id, token) {
		return apiService.put(`/user/${id}`, data, id, token);
	},

	async updateUserAssignedLeads(data, id) {
		return apiService.put(`/user/lead/${id}`, data, id);
	},

	async getAllMemberGroups(id) {
		return apiService.get(`/user/groups/${id}`);
	},

	async getAllUsers() {
		return apiService.get(`/user`);
	},

	async getUserInfo(id) {
		return apiService.get(`/user/${id}`);
	},

	async getAllManagers() {
		return apiService.get(`/user/managers`);
	},

	async getAllSalesAgents() {
		return apiService.get(`/user/not-managers`);
	},

	async signUp(data) {
		return apiService.post("/user/register", data);
	},

	async verifyUser(data) {
		return apiService.post("/user/verify-email", data);
	},

	async getUserPermission(id) {
		return apiService.get(`/permissions/${id}`);
	},

	async addUserPermission(data) {
		return apiService.post(`/permissions/`, data);
	},

	async updateUserPermission(data, id) {
		return apiService.put(`/permissions/${id}`, data, id);
	},

	async getAllEmployeesByRole() {
		return apiService.get(`/user/emp-roles`);
	},
};

export default UserService;
