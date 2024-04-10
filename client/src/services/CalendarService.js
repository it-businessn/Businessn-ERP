import apiService from "services";

const CalendarService = {
	async getEvents() {
		return apiService.get("/events");
	},

	async getEventsByType(type) {
		return apiService.get(`/events/${type}`);
	},

	async addEvent(data) {
		return apiService.post("/events", data);
	},

	async updateEvent(data, id) {
		return apiService.put(`/events/${id}`, data, id);
	},

	async getMeetingsByContactId(id) {
		return apiService.get(`/meetings/${id}`);
	},

	async addMeeting(data) {
		return apiService.post("/meetings", data);
	},
};

export default CalendarService;
