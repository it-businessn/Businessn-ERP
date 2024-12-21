import apiService from "services";

const TicketService = {
	async getInfo() {
		return apiService.get("/ticket");
	},

	async addInfo(data) {
		return apiService.post("/ticket", data);
	},

	async updateInfo(data, id) {
		return apiService.put(`/ticket/${id}`, data, id);
	},
};

export default TicketService;
