import apiService from "services";

const UserService = {
	async updateUserProfile(data, id) {
		return apiService.put(`/user/${id}`, data, id);
	},

	async updateUserInfoById(data, id, token) {
		return apiService.put(`/user/${id}`, data, id, token);
	},

	async updateUserAssignedLeads(data, id) {
		return apiService.put(`/user/assignLeads`, data, id);
	},

	async getAllMemberGroups(data) {
		return apiService.get(`/user/groups/${data.userId}/${data.company}`);
	},

	async getAllUsers() {
		return apiService.get(`/user`);
	},

	async getAllUserActivity() {
		return apiService.get(`/user/activity`);
	},

	async getPayrollActiveCompanyUsers(id) {
		return apiService.get(`/user/payroll-active/${id}`);
	},

	async getAllCompanyUsers(id) {
		return apiService.get(`/user/${id}`);
	},

	async getAllManagers(id) {
		return apiService.get(`/user/managers/${id}`);
	},

	async getAllSalesAgents(id) {
		return apiService.get(`/user/not-managers/${id}`);
	},

	async signUp(data) {
		return apiService.post("/user/register", data);
	},

	async verifyUser(data) {
		return apiService.post("/user/verify-email", data);
	},

	async getUserPermission(data) {
		return apiService.get(`/permissions/${data.userId}/${data.company}`);
	},

	async addUserPermission(data) {
		return apiService.post(`/permissions/`, data);
	},

	async updateUserPermission(data, id) {
		return apiService.put(`/permissions/${id}`, data, id);
	},

	async getAllEmployeesByRole(id) {
		return apiService.get(`/user/emp-roles/${id}`);
	},
};

export default UserService;
