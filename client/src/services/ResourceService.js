import apiService from "services";

const ResourceService = {
	async getResources() {
		return apiService.get("/companyResource");
	},

	async getResourcesByType(id) {
		return apiService.get(`/companyResource/${id}`);
	},

	async upload(data) {
		return apiService.post("/companyResource/upload", data);
	},
};

export default ResourceService;
