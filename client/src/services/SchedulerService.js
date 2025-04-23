import apiService from "services";

const SchedulerService = {
	async getShifts() {
		return apiService.get(`/schedule/`);
	},

	async getShiftsByDate(data) {
		return apiService.get(`/schedule/${data.date}/${data.company}`);
	},

	async getWorkShiftsByDate(data) {
		return apiService.get(`/schedule/work/${data.date}/${data.location}/${data.company}`);
	},

	async getTaskByAssignee(name) {
		return apiService.get(`/tasks/${name}`);
	},

	async addShifts(data) {
		return apiService.post("/schedule", data);
	},

	async addWorkShifts(data) {
		return apiService.post("/schedule/work", data);
	},

	async updateShift(data, id) {
		return apiService.put(`/schedule/${id}`, data, id);
	},
};

export default SchedulerService;
