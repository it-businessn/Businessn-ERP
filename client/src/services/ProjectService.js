import apiService from "services";

const ProjectService = {
	async getAllProjects() {
		return apiService.get("/projects");
	},

	async addProject(data) {
		return apiService.post("/projects", data);
	},

	async updateProject(data, id) {
		return apiService.put(`/projects/${id}`, data, id);
	},

	async addProjectTask(data, id) {
		return apiService.put(`/projects/task/${id}`, data, id);
	},
};

export default ProjectService;
