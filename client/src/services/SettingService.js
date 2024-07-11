import apiService from "services";

const SettingService = {
	async getIdleLeadReAssignment() {
		return apiService.get("/setup");
	},

	async setUpIdleLeadReAssignment(data) {
		return apiService.post("/setup", data);
	},

	async updateSetUpIdleLeadReAssignment(data, id) {
		return apiService.put(`/setup/${id}`, data, id);
	},

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
		return apiService.put(`/setup/modules/${id}`, data, id);
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
		return apiService.get(`/setup/companies/employees/${id}`);
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
};

export default SettingService;
