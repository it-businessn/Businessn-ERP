import apiService from "services";

const LeadsService = {
	async getNotDisbursedLeads(data) {
		return apiService.get("/leads/not-disbursed", data);
	},

	async getDisbursedLeads(data) {
		return apiService.get("/leads/disburse", data);
	},

	async getConfirmedDisbursedLeads(data) {
		return apiService.get("/leads/disburse/isConfirmed", data);
	},

	async getOpportunities() {
		return apiService.get("/leads/opportunities");
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
