import apiService from "services";

const ResourceService = {
	async getResources() {
		return apiService.get("/companyResource");
	},
	async getResourcesByCompany(id) {
		return apiService.get(`/companyResource/${id}`);
	},

	async getResourcesByType(data) {
		return apiService.get(`/companyResource/type/${data.type}/${data.company}`);
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
