import apiService from "services";

const DashboardService = {
	async getAllProjects() {
		return apiService.get("/projects");
	},
};

export default DashboardService;
