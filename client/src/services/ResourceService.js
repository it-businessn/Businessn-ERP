import apiService from "services";

const ResourceService = {
	async getResources() {
		return apiService.get("/resources");
	},

	async getResourcesByType(id) {
		return apiService.get(`/resources/${id}`);
	},

	async upload(data) {
		return apiService.post("/resources/upload", data);
	},
};

export default ResourceService;
