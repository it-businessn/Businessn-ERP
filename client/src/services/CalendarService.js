import apiService from "services";

const CalendarService = {
	async getEvents() {
		return apiService.get("/events");
	},

	async getCompEvents(data) {
		return apiService.get(`/events/calendar/${data.name}/${data.company}`);
	},

	async getEventsByType(data) {
		return apiService.get(`/events/${data.type}/${data.company}`);
	},

	async getUserEventsByType(data) {
		return apiService.get(`/events/${data.type}/${data.name}/${data.company}`);
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
