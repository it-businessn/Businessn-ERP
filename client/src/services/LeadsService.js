import apiService from "services";

const LeadsService = {
	async getNotDisbursedLeads(data) {
		return apiService.get("/leads/not-disbursed", data);
	},

	async getLeadCompanies(data) {
		return apiService.get("/leads/companies", data);
	},

	async getDisbursedLeads(data) {
		return apiService.get("/leads/disburse", data);
	},

	async getConfirmedDisbursedLeads(data) {
		return apiService.get("/leads/disburse/isConfirmed", data);
	},

	async deleteLead(data, id) {
		return apiService.delete(`/leads/${id}`, data, id);
	},

	async getGroupedOpportunities() {
		return apiService.get("/leads/grouped-opportunities");
	},

	async getOpportunities() {
		return apiService.get("/leads/opportunities");
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
