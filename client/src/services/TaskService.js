import apiService from "services";

const TaskService = {
	async getTaskByContactId(id) {
		return apiService.get(`/tasks/${id}`);
	},

	async getTaskByAssignee(data) {
		return apiService.get(`/tasks/${data.name}/${data.company}`);
	},

	async addTask(data) {
		return apiService.post("/tasks", data);
	},

	async updateTask(data, id) {
		return apiService.put(`/tasks/${id}`, data, id);
	},
};

export default TaskService;
