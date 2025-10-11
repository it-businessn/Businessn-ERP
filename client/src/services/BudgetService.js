import apiService from "services";

const BudgetService = {
	async getDeptBudgetAccounts(company, dept) {
		return apiService.get(`/budgeting/${company}/${dept}`);
	},

	async getAccountJournalEntries(id, accName) {
		return apiService.get(`/budgeting/general-journal/${id}/${accName}`);
	},

	async addAccount(data) {
		return apiService.post("/budgeting", data);
	},

	async updateAccount(data, id) {
		return apiService.put(`/budgeting/${id}`, data, id);
	},
};

export default BudgetService;
