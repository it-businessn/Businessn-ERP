import apiService from "services";

const SettingService = {
	async getConfigurationsByName(id) {
		return apiService.get(`/configuration/${id}`);
	},

	async getAllRoles(id) {
		return apiService.get(`/setup/roles/${id}`);
	},

	async addRole(data) {
		return apiService.post("/setup/roles", data);
	},

	async getAllDepartments(id) {
		return apiService.get(`/setup/departments/${id}`);
	},

	async addDepartment(data) {
		return apiService.post("/setup/departments", data);
	},

	async getAllModules(id) {
		return apiService.get(`/setup/modules/${id}`);
	},

	async addBaseModule(data) {
		return apiService.post("/setup/modules", data);
	},

	async updateModuleActiveStatus(data, id) {
		return apiService.put(`/setup/modules-status/${id}`, data, id);
	},

	async getAllGroups(id) {
		return apiService.get(`/setup/groups/${id}`);
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

	async getAllCompaniesByUser(id) {
		return apiService.get(`/setup/companies/user/${id}`);
	},

	async getCompanyInfo(id) {
		return apiService.get(`/setup/companies/${id}`);
	},

	async addCompany(data) {
		return apiService.post("/setup/companies", data);
	},

	async getAllEmploymentTypes(id) {
		return apiService.get(`/setup/empTypes/${id}`);
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
		return apiService.get("/setup/idle-lead-config");
	},

	async setUpIdleLeadReAssignment(data) {
		return apiService.post("/setup/idle-lead", data);
	},

	async updateSetUpIdleLeadReAssignment(data, id) {
		return apiService.put(`/setup/idle-lead/${id}`, data, id);
	},
};

export default SettingService;
