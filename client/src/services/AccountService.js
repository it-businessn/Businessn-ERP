import apiService from "services";

const AccountService = {
	async getAllAccounts(id) {
		return apiService.get(`/accounting/${id}`);
	},

	async getAllAccountsByDept(company, dept) {
		return apiService.get(`/accounting/dept/${company}/${dept}`);
	},

	async getAccountJournalEntries(id, accName) {
		return apiService.get(`/accounting/general-journal/${id}/${accName}`);
	},

	async addAccount(data) {
		return apiService.post("/accounting", data);
	},

	async addJournalEntry(data) {
		return apiService.post("/accounting/general-journal", data);
	},
};

export default AccountService;
