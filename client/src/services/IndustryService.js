import apiService from "services";

const IndustryService = {
	async getIndustryType() {
		return apiService.get("/industry");
	},

	async addIndustryType(data) {
		return apiService.post("/industry", data);
	},
};

export default IndustryService;
