import apiService from "services";

const ProjectService = {
	async getAllProjects() {
		return apiService.get("/projects");
	},

	async getAllCompanyFiles(id) {
		return apiService.get(`/projects/${id}`);
	},

	async getAllCompanyFilesByAssignee(id, company) {
		return apiService.get(`/projects/${id}/${company}`);
	},

	async addProjectFile(data) {
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

	async updateProjectFile(data, id) {
		return apiService.put(`/projects/file/${id}`, data, id);
	},

	async addProject(data, id) {
		return apiService.put(`/projects/file-project/${id}`, data, id);
	},

	async addTask(data, id) {
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

	async updateInnerSubTaskName(data, id) {
		return apiService.put(`/projects/update-inner-subtask/name/${id}`, data, id);
	},

	async updateSubTaskName(data, id) {
		return apiService.put(`/projects/update-subtask/name/${id}`, data, id);
	},

	async updateTaskName(data, id) {
		return apiService.put(`/projects/update-task/name/${id}`, data, id);
	},

	async updateProjectName(data, id) {
		return apiService.put(`/projects/update-project/name/${id}`, data, id);
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
