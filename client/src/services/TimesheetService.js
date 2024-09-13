import apiService from "services";

const TimesheetService = {
	async getTimesheets(company) {
		return apiService.get(`/timesheet/${company}`);
	},

	async getFilteredTimesheets(company, filter) {
		return apiService.get(
			`/timesheet/filtered/${company}/filter=${JSON.stringify(filter)}`,
		);
	},

	async getTimesheetById(company, id) {
		return apiService.get(`/timesheet/${company}/${id}`);
	},

	async addTimesheet(data) {
		return apiService.post("/timesheet", data);
	},

	async updateTimesheet(data, id) {
		return apiService.put(`/timesheet/${id}`, data, id);
	},
};

export default TimesheetService;
