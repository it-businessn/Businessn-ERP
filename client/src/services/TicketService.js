import apiService from "services";

const TicketService = {
	async getInfo(id) {
		return apiService.get(`/ticket/${id}`);
	},

	async getOpenTicket(id, companyName) {
		return apiService.get(`/ticket/open/${id}/${companyName}`);
	},

	async getClosedTicket(id, companyName) {
		return apiService.get(`/ticket/closed/${id}/${companyName}`);
	},

	async addInfo(data) {
		return apiService.post("/ticket", data);
	},

	async saveCustomerPricingInfo(data) {
		return apiService.post("/ticket/pricing", data);
	},

	async updateInfo(data, id) {
		return apiService.put(`/ticket/${id}`, data, id);
	},
};

export default TicketService;
