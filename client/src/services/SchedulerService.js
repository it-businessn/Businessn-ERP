import apiService from "services";

const SchedulerService = {
	async getShifts() {
		return apiService.get(`/schedule/`);
	},

	async getShiftsByDate(date) {
		return apiService.get(`/schedule/${date}`);
	},

	async getTaskByAssignee(name) {
		return apiService.get(`/tasks/${name}`);
	},

	async addShifts(data) {
		return apiService.post("/schedule", data);
	},

	async updateShift(data, id) {
		return apiService.put(`/schedule/${id}`, data, id);
	},
};

export default SchedulerService;
