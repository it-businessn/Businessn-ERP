import apiService from "services";

const ContactService = {
	async getContacts() {
		return apiService.get("/contacts");
	},

	async getCompContacts(id) {
		return apiService.get(`/contacts/${id}`);
	},

	async getOnboardedContacts(id) {
		return apiService.get(`/contacts/onboard/${id}`);
	},

	async getContactDetails(data) {
		return apiService.get(`/contacts/${data.id}/${data.company}`);
	},

	async addContact(data) {
		return apiService.post("/contacts", data);
	},

	async updateContact(data, id) {
		return apiService.put(`/contacts/${id}`, data, id);
	},

	async contactCustomer(data) {
		return apiService.post(`/contacts/followup`, data);
	},
};

export default ContactService;
