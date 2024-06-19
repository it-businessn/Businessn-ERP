import apiService from "services";

const ActivityService = {
	async getActivities(data) {
		return apiService.get(`/activities/${data.id}/${data.company}`);
	},

	async getActivitiesByContactId(id) {
		return apiService.get(`/activities/${id}`);
	},

	async getActivitiesByUser(data) {
		return apiService.get(
			`/activities/user/${data.id}/${data.company}/${data.type}`,
		);
	},

	async addActivity(data) {
		return apiService.post("/activities", data);
	},
};

export default ActivityService;
