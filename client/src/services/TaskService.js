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

	async updateTaskStatus(data, id) {
		return apiService.put(`/tasks/status/${id}`, data, id);
	},

	async updateSubTaskStatus(data, id) {
		return apiService.put(`/tasks/subtask/status/${id}`, data, id);
	},

	async updateInnerSubTaskStatus(data, id) {
		return apiService.put(`/tasks/subtask-child/status/${id}`, data, id);
	},

	async updateTaskActivityStatus(data, id) {
		return apiService.put(`/tasks/activity/status/${id}`, data, id);
	},
};

export default TaskService;
