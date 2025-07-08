import apiService from "services";

const TimesheetService = {
	async getTimesheets(company) {
		return apiService.get(`/timesheet/${company}`);
	},

	async getTimecards(companyName, filter, queryParams) {
		return apiService.get(`/timecard/${companyName}/filter=${JSON.stringify(filter)}`, queryParams);
	},

	async getTimecardTADUsers() {
		return apiService.get(`/timecard/tad-users`);
	},

	async getFilteredTimesheets(company, filter, queryParams, params, signal) {
		return apiService.get(
			`/timesheet/filtered/${company}/filter=${JSON.stringify(filter)}`,
			queryParams,
			params,
			signal,
		);
	},

	async getFilteredTimesheetsByStatus(company, filter) {
		return apiService.get(`/timesheet/filtered-status/${company}/filter=${JSON.stringify(filter)}`);
	},

	async getTimesheetById(company, id, filter) {
		return apiService.get(`/timesheet/${company}/${id}/filter=${JSON.stringify(filter)}`);
	},

	async addTimesheetManual(data) {
		return apiService.post("/timesheet/manual", data);
	},

	async addTimesheet(data) {
		return apiService.post("/timesheet", data);
	},

	async addLeave(data) {
		return apiService.post("/leave-requests", data);
	},

	async addTimecard(data) {
		return apiService.post("/timecard", data);
	},

	async addTimecardManual(data) {
		return apiService.post("/timecard/manual", data);
	},

	async updateTimesheet(data, id) {
		return apiService.put(`/timesheet/${id}`, data, id);
	},

	async updateRoleTimesheet(data, id) {
		return apiService.put(`/timesheet/role/${id}`, data, id);
	},

	async updateTimesheetPayType(data, id) {
		return apiService.put(`/timesheet/paytype/${id}`, data, id);
	},

	async actionAllTimesheets(data) {
		return apiService.post("/timesheet/action", data);
	},

	async deleteEntry(data, id) {
		return apiService.put(`/timesheet/delete-entry/${id}`, data, id);
	},
};

export default TimesheetService;
