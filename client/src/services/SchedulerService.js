import apiService from "services";

const SchedulerService = {
	async getShifts() {
		return apiService.get(`/schedule/`);
	},

	async getShiftsByDate(data) {
		return apiService.get(`/schedule/${data.date}/${data.company}`);
	},

	async getExpenseOverview(company, crew) {
		return apiService.get(`/schedule/expense-overview/${company}/${crew}`);
	},

	async getAvgHeadCountTotals(company, crew) {
		return apiService.get(`/schedule/avg-headCount-totals/${company}/${crew}`);
	},

	async getDailyStatistics(company, month, crew) {
		return apiService.get(`/schedule/daily-stats/${company}/${month}/${crew}`);
	},

	async getLocationMonthlyTotals(company, month, crew) {
		return apiService.get(`/schedule/role-monthlyTotals/${company}/${month}/${crew}`);
	},

	async getWorkShiftsByDate(data) {
		return apiService.get(
			`/schedule/work/${data.date}/${data.location}/${data.empName}/${data.company}`,
		);
	},

	async getScheduleEmailLogs(company, week) {
		return apiService.get(`/schedule/email-logs/${company}/${week}`);
	},

	async getWorkWeekEmpShifts(date, company, crewId) {
		return apiService.get(`/schedule/work-emp-shift/${date}/${company}/${crewId}`);
	},

	async getWorkShiftsByWeek(data) {
		return apiService.get(
			`/schedule/work-week/${data.date}/${data.location}/${data.empName}/${data.company}`,
		);
	},

	async getEmpWorkShiftsByDate(data) {
		return apiService.get(
			`/schedule/work/emp/${data.date}/${data.location}/${data.empName}/${data.company}`,
		);
	},

	async getTaskByAssignee(name) {
		return apiService.get(`/tasks/${name}`);
	},

	async addShifts(data) {
		return apiService.post("/schedule", data);
	},

	async sendSchedule(data) {
		return apiService.post("/schedule/send", data);
	},

	async addWorkShifts(data) {
		return apiService.post("/schedule/work", data);
	},

	async repeatWeeklySchedule(data) {
		return apiService.post("/schedule/repeat-week-schedule", data);
	},

	async updateDailyTotals(data) {
		return apiService.post("/schedule/dailyTotals", data);
	},

	async updateShift(data, id) {
		return apiService.put(`/schedule/${id}`, data, id);
	},

	async deleteShift(data, id) {
		return apiService.delete(`/schedule/${id}`, data, id);
	},
};

export default SchedulerService;
