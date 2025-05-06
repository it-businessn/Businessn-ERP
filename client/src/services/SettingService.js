import apiService from "services";
import { CURRENT_YEAR } from "utils/convertDate";

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

	async getAllPositionRoles(id) {
		return apiService.get(`/setup/position-roles/${id}`);
	},

	async getAllLocations(id) {
		return apiService.get(`/setup/location/${id}`);
	},

	async getAllCrews(id) {
		return apiService.get(`/setup/crews/${id}`);
	},

	async getStatHolidays(id) {
		return apiService.get(`/setup/stat-holidays/${id}/${CURRENT_YEAR}`);
	},

	async addStatHoliday(data) {
		return apiService.post("/setup/stat-holidays", data);
	},

	async deleteHoliday(data, id) {
		return apiService.delete(`/setup/stat-holidays/${id}`, data, id);
	},

	async addRole(data) {
		return apiService.post("/setup/roles", data);
	},

	async addPositionRole(data) {
		return apiService.post("/setup/position-roles", data);
	},

	async addLocation(data) {
		return apiService.post("/setup/location", data);
	},

	async getAllDepartments(id) {
		return apiService.get(`/setup/departments/${id}`);
	},

	async getAllCC(id) {
		return apiService.get(`/setup/cost-centers/${id}`);
	},

	async addDepartment(data) {
		return apiService.post("/setup/departments", data);
	},

	async addCC(data) {
		return apiService.post("/setup/cost-centers", data);
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

	async updateCompany(data, id) {
		return apiService.put(`/setup/companies/${id}`, data, id);
	},

	async getAllEmploymentTypes(id) {
		return apiService.get(`/setup/empTypes/${id}`);
	},

	async addEmploymentType(data) {
		return apiService.post("/setup/empTypes", data);
	},
};

export default SettingService;
