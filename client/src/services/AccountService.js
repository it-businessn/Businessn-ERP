import apiService from "services";

const AccountService = {
	async geAccount(id) {
		return apiService.get(`/accounting/${id}`);
	},

	async addAccount(data) {
		return apiService.post("/accounting", data);
	},

	async addJournalEntry(data) {
		return apiService.post("/accounting/general-journal", data);
	},
};

export default AccountService;
