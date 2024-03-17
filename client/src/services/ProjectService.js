import apiService from "services";

const ProjectService = {
	async getAllProjects() {
		return apiService.get("/projects");
	},

	async addProject(data) {
		return apiService.post("/projects", data);
	},

	async addActivity(data) {
		return apiService.post(`/projects/activity`, data);
	},

	async updateProject(data, id) {
		return apiService.put(`/projects/${id}`, data, id);
	},

	async addProjectTask(data, id) {
		return apiService.put(`/projects/task/${id}`, data, id);
	},

	async addProjectSubTask(data, id) {
		return apiService.put(`/projects/subtask/${id}`, data, id);
	},

	async addTaskActivity(data, id) {
		return apiService.put(`/projects/task/activity/${id}`, data, id);
	},

	async updateTaskStatus(data, id) {
		return apiService.put(`/projects/task/status/${id}`, data, id);
	},

	async updateSubTaskStatus(data, id) {
		return apiService.put(`/projects/subtask/status/${id}`, data, id);
	},

	async updateTaskActivityStatus(data, id) {
		return apiService.put(`/projects/activity/status/${id}`, data, id);
	},
};

export default ProjectService;
