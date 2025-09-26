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

	async getPayrollActiveCompanyUserCount(id) {
		return apiService.get(`/user/payroll-active-count/${id}`);
	},

	async getPayrollActiveCompanyUsers(id, deptName, payGroup) {
		return apiService.get(`/user/payroll-active/${id}/${deptName}/${payGroup}`);
	},

	async getPayrollInActiveCompanyUsers(id, deptName, payGroup) {
		return apiService.get(`/user/payroll-inactive/${id}/${deptName}/${payGroup}`);
	},

	async getPayrollTerminatedCompanyUsers(id, deptName, payGroup) {
		return apiService.get(`/user/payroll-terminated/${id}/${deptName}/${payGroup}`);
	},

	async getAllCompanyUsersCount(id) {
		return apiService.get(`/user/count/${id}`);
	},

	async getCompanyUsers(id) {
		return apiService.get(`/user/all/${id}`);
	},

	async getAllEmpCompanyUsers(id) {
		return apiService.get(`/user/emp/${id}`);
	},

	async getAllCompanyUsers(id, deptName, payGroup) {
		return apiService.get(`/user/${id}/${deptName}/${payGroup}`);
	},

	async getAllCompManagers(id) {
		return apiService.get(`/user/comp-managers/${id}`);
	},

	async getAllAdmin(id) {
		return apiService.get(`/user/admin/${id}`);
	},

	async getAllManagers(id) {
		return apiService.get(`/user/managers/${id}`);
	},

	async getAllSalesAgents(id) {
		return apiService.get(`/user/not-managers/${id}`);
	},

	async getAllSalesAgentsDashboard(id) {
		return apiService.get(`/user/not-managers-list/${id}`);
	},

	async sendEmailLoginCreds(data) {
		return apiService.post("/user/send-email", data);
	},

	async sendEmailPaystubs(data) {
		return apiService.post("/user/send-paystub", data);
	},

	async addMasterUser(data) {
		return apiService.post("/user/create", data);
	},

	async updateMasterUser(data, id) {
		return apiService.put(`/user/master/${id}`, data, id);
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
