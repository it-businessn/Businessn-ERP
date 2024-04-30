import apiService from "services";

const ContactService = {
	async getContacts() {
		return apiService.get("/contacts");
	},

	async getContactDetails(id) {
		return apiService.get(`/contacts/${id}`);
	},

	async getIndustryType() {
		return apiService.get("/contacts/industry-type");
	},

	async addContact(data) {
		return apiService.post("/contacts", data);
	},

	async addIndustryType(data) {
		return apiService.post("/contacts/industry-type", data);
	},

	async updateContact(data, id) {
		return apiService.put(`/contacts/${id}`, data, id);
	},
};

export default ContactService;
