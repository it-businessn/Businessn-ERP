import apiService from "services";

const LeadsService = {
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
};

export default LeadsService;
