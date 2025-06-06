import apiService from "services";

const LeadsService = {
	async getNotDisbursedLeads(companyName, filter, queryParams) {
		return apiService.get(
			`/leads/not-disbursed/${companyName}/filter=${JSON.stringify(filter)}`,
			queryParams,
		);
	},

	async getLeadCompanies(id) {
		return apiService.get(`/leads/companies/${id}`);
	},

	async getDisbursedLeads(company) {
		return apiService.get(`/leads/disburse/${company}`);
	},

	async getLeadInfo(data) {
		return apiService.get(`/leads/${data.id}/${data.company}`);
	},

	// async getConfirmedDisbursedLeads(data) {
	// 	return apiService.get("/leads/disburse/isConfirmed", data);
	// },

	async getFreshLeads(id) {
		return apiService.get(`/leads/disburse/isConfirmed/${id}`);
	},

	async getTargetLeads(id) {
		return apiService.get(`/leads/targets/${id}`);
	},

	async deleteLead(data, id) {
		return apiService.delete(`/leads/${id}`, data, id);
	},

	async getGroupedOpportunities() {
		return apiService.get("/leads/grouped-opportunities");
	},

	async getGroupedOpportunitiesByCompany(id) {
		return apiService.get(`/leads/${id}`);
	},

	async getOpportunityNames(id) {
		return apiService.get(`/leads/opportunity-names/${id}`);
	},

	async getOpportunities(companyName, filter, queryParams) {
		return apiService.get(
			`/leads/opportunities/${companyName}/filter=${JSON.stringify(filter)}`,
			queryParams,
		);
	},

	async createMultipleOpportunity(data) {
		return apiService.post("/leads/multiple-opportunities", data);
	},

	async addLeadCompany(data) {
		return apiService.post("/leads/companies", data);
	},

	async getOpportunitiesByCategory() {
		return apiService.get("/opportunities/category");
	},

	async createOpportunity(data) {
		return apiService.post("/leads/opportunity", data);
	},

	async updateOpportunity(data, id) {
		return apiService.put(`/opportunities/${id}`, data, id);
	},

	async updateLeadInfo(data, id) {
		return apiService.put(`/leads/opportunity/${id}`, data, id);
	},

	async disburseLeads(data) {
		return apiService.post("/leads/disburse", data);
	},

	async confirmDisburseLeads(data) {
		return apiService.post("/leads/confirm-disburse", data);
	},
};

export default LeadsService;
