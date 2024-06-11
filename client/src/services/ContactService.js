import apiService from "services";

const ContactService = {
	async getContacts() {
		return apiService.get("/contacts");
	},
	async getCompContacts(id) {
		return apiService.get(`/contacts/comp/${id}`);
	},
	async getContactDetails(data) {
		return apiService.get(`/contacts/${data.id}//${data.company}`);
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
