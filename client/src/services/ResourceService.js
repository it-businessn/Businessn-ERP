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

	async deleteResource(data, id) {
		return apiService.delete(`/companyResource/${id}`, data, id);
	},

	async updateResource(data, id) {
		return apiService.put(`/companyResource/${id}`, data, id);
	},
};

export default ResourceService;
