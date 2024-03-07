import apiService from "services";

const ProjectService = {
	async getAllProjects() {
		return apiService.get("/projects");
	},

	async addTask(data) {
		return apiService.post("/projects", data);
	},
};

export default ProjectService;
