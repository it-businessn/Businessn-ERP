import apiService from "services";

const ResourceService = {
	async getResources() {
		return apiService.get("/resource");
	},
	async getResourcesByCompany(id) {
		return apiService.get(`/resource/${id}`);
	},

	async getResourcesByType(data) {
		return apiService.get(`/resource/type/${data.type}/${data.company}`);
	},

	async upload(data) {
		return apiService.post("/resource/upload", data);
	},

	async deleteResource(data, id) {
		return apiService.delete(`/resource/${id}`, data, id);
	},

	async updateResource(data, id) {
		return apiService.put(`/resource/${id}`, data, id);
	},
};

export default ResourceService;
