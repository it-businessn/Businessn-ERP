import apiService from "services";

const SettingService = {
	async getConfigurationsByName(id) {
		return apiService.get(`/configuration/${id}`);
	},

	async getAllRoles() {
		return apiService.get(`/setup/roles`);
	},

	async addRole(data) {
		return apiService.post("/setup/roles", data);
	},

	async getAllDepartments() {
		return apiService.get(`/setup/departments`);
	},

	async addDepartment(data) {
		return apiService.post("/setup/departments", data);
	},

	async getAllModules() {
		return apiService.get(`/setup/modules`);
	},

	async addBaseModule(data) {
		return apiService.post("/setup/modules", data);
	},

	async updateModuleActiveStatus(data, id) {
		return apiService.put(`/setup/modules-status/${id}`, data, id);
	},

	async getAllGroups() {
		return apiService.get(`/setup/groups`);
	},

	async addGroup(data) {
		return apiService.post("/setup/groups", data);
	},

	async updateGroup(data, id) {
		return apiService.put(`/setup/groups/${id}`, data, id);
	},

	async getAllCompanies() {
		return apiService.get(`/setup/companies`);
	},

	async getCompanyInfo(id) {
		return apiService.get(`/setup/companies/${id}`);
	},

	async addCompany(data) {
		return apiService.post("/setup/companies", data);
	},

	async getAllEmploymentTypes() {
		return apiService.get(`/setup/empTypes`);
	},

	async addEmploymentType(data) {
		return apiService.post("/setup/empTypes", data);
	},

	async getAllApprovers() {
		return apiService.get(`/setup/approvers`);
	},

	async addApprover(data) {
		return apiService.post("/setup/approvers", data);
	},

	async getIdleLeadReAssignment() {
		return apiService.get("/set-up/idle-lead-config");
	},

	async setUpIdleLeadReAssignment(data) {
		return apiService.post("/set-up/idle-lead", data);
	},

	async updateSetUpIdleLeadReAssignment(data, id) {
		return apiService.put(`/set-up/idle-lead/${id}`, data, id);
	},
};

export default SettingService;
