import apiService from "services";

const ProjectService = {
	async getAllProjects() {
		return apiService.get("/projects");
	},
};

export default ProjectService;
