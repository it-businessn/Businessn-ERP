import apiService from "services";

const TimesheetService = {
	async getTimesheets() {
		return apiService.get(`/timesheet`);
	},

	async getTimesheetById(id) {
		return apiService.get(`/timesheet/${id}`);
	},

	async addTimesheet(data) {
		return apiService.post("/timesheet", data);
	},

	async updateTimesheet(data, id) {
		return apiService.put(`/timesheet/${id}`, data, id);
	},
};

export default TimesheetService;
