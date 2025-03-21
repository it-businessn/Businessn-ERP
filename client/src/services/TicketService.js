import apiService from "services";

const TicketService = {
	async getInfo(id) {
		return apiService.get(`/ticket/${id}`);
	},

	async getAggregateTicketCount(userId, companyName) {
		return apiService.get(`/ticket/count/${userId}/${companyName}`);
	},

	async getOpenTicket(userId, companyName) {
		return apiService.get(`/ticket/open/${userId}/${companyName}`);
	},

	async filterTicket(userId, companyName, name) {
		return apiService.get(`/ticket/filter/${userId}/${companyName}/${name}`);
	},

	async getClosedTicket(userId, companyName) {
		return apiService.get(`/ticket/closed/${userId}/${companyName}`);
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
