import apiService from "services";

const LogTaskService = {
	async getTaskByContactId(id) {
		return apiService.get(`/log-tasks/${id}`);
	},

	async getTaskByAssignee(name) {
		return apiService.get(`/log-tasks/${name}`);
	},

	async addTask(data) {
		return apiService.post("/log-tasks", data);
	},

	async updateTask(data, id) {
		return apiService.put(`/log-tasks/${id}`, data, id);
	},
};

export default LogTaskService;
