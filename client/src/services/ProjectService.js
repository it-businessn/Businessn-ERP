import apiService from "services";

const ProjectService = {
	async getAllProjects() {
		return apiService.get("/projects");
	},

	async getAllCompanyProjects(id) {
		return apiService.get(`/projects/${id}`);
	},

	async getAllCompanyProjectsByUser(id, company) {
		return apiService.get(`/projects/${id}/${company}`);
	},

	async addProject(data) {
		return apiService.post("/projects", data);
	},

	async addSchedulingProjectTask(data) {
		return apiService.post("/projects/scheduling", data);
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

	async addSubTask(data, id) {
		return apiService.put(`/projects/task-subtask/${id}`, data, id);
	},

	async addSubTasks(data, id) {
		return apiService.put(`/projects/task-add-subtask/${id}`, data, id);
	},

	async updateSubTask(data, id) {
		return apiService.put(`/projects/update-subtask/${id}`, data, id);
	},

	async updateProjectTask(data, id) {
		return apiService.put(`/projects/update-task/${id}`, data, id);
	},

	async addProjectSubTask(data, id) {
		return apiService.put(`/projects/subtask/${id}`, data, id);
	},

	async addTaskActivity(data, id) {
		return apiService.put(`/projects/task/activity/${id}`, data, id);
	},

	async deleteTask(data, id) {
		return apiService.delete(`/projects/task/${id}`, data, id);
	},

	async deleteSubTask(data, id) {
		return apiService.delete(`/projects/subtask/${id}`, data, id);
	},

	async deleteInnerSubTask(data, id) {
		return apiService.put(`/projects/subtask-child/${id}`, data, id);
	},

	async updateInnerSubTask(data, id) {
		return apiService.put(`/projects/inner-subtask/${id}`, data, id);
	},
};

export default ProjectService;
