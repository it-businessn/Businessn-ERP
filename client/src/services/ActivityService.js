import apiService from "services";

const ActivityService = {
	async getActivities() {
		return apiService.get("/activities");
	},

	async getActivitiesByContactId(id) {
		return apiService.get(`/activities/${id}`);
	},

	async addActivity(data) {
		return apiService.post("/activities", data);
	},
};

export default ActivityService;
