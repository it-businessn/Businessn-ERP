import apiService from "services";

const OpportunityService = {
	async getOpportunities() {
		return apiService.get("/opportunities");
	},

	async getOpportunitiesByCategory() {
		return apiService.get("/opportunities/category");
	},

	async addOpportunity(data) {
		return apiService.post("/opportunities", data);
	},

	async updateOpportunity(data, id) {
		return apiService.put(`/opportunities/${id}`, data, id);
	},
};

export default OpportunityService;
