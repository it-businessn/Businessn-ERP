import apiService from "services";

const AccountService = {
	async geAccount(id) {
		return apiService.get(`/accounting/${id}`);
	},

	async addAccount(data) {
		return apiService.post("/accounting", data);
	},
};

export default AccountService;
