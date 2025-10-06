import apiService from "services";

const SchedulerService = {
	async getShifts() {
		return apiService.get(`/schedule/`);
	},

	async getShiftsByDate(data) {
		return apiService.get(`/schedule/${data.date}/${data.company}`);
	},

	async getDailyTotals(company) {
		return apiService.get(`/schedule/dailyTotals/${company}`);
	},

	async getLocationMonthlyTotals(company) {
		return apiService.get(`/schedule/location-monthlyTotals/${company}`);
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

	async updateDailyTotals(data) {
		return apiService.post("/schedule/dailyTotals", data);
	},

	async updateShift(data, id) {
		return apiService.put(`/schedule/${id}`, data, id);
	},
};

export default SchedulerService;
