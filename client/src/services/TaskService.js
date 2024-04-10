import apiService from "services";

const TaskService = {
	async getTaskByContactId(id) {
		return apiService.get(`/tasks/${id}`);
	},

	async getTaskByAssignee(name) {
		return apiService.get(`/tasks/${name}`);
	},

	async addTask(data) {
		return apiService.post("/tasks", data);
	},

	async updateTask(data, id) {
		return apiService.put(`/tasks/${id}`, data, id);
	},
};

export default TaskService;
