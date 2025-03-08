import apiService from "services";

const TicketService = {
	async getInfo(id) {
		return apiService.get(`/ticket/${id}`);
	},

	async getClosedTicket(id) {
		return apiService.get(`/ticket/closed/${id}`);
	},

	async addInfo(data) {
		return apiService.post("/ticket", data);
	},

	async updateInfo(data, id) {
		return apiService.put(`/ticket/${id}`, data, id);
	},
};

export default TicketService;
