import apiService from "services";

const NotificationService = {
	async getAllProjects() {
		return apiService.get("/projects");
	},
};

export default NotificationService;
