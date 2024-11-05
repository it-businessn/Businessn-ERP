import apiService from "services";

const TimesheetService = {
	async getTimesheets(company) {
		return apiService.get(`/timesheet/${company}`);
	},

	async getTimecards(companyName) {
		return apiService.get(`/timecard/${companyName}`);
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

	async addTimecard(data) {
		return apiService.post("/timecard", data);
	},

	async updateTimesheet(data, id) {
		return apiService.put(`/timesheet/${id}`, data, id);
	},

	async deleteEntry(data, id) {
		return apiService.delete(`/timesheet/${id}`, data, id);
	},
};

export default TimesheetService;
