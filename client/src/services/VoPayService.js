import apiService from "services";

const VoPayService = {
	async addPartnerEmployer(data) {
		return apiService.post("/vopay/partner/account", data);
	},

	async getPartnerEmployerAccounts() {
		return apiService.get("/vopay/partner/account");
	},

	async getClientAccountWallets() {
		return apiService.get("/vopay/account/client-accounts");
	},

	async createClientEmployee(data) {
		return apiService.post("/vopay/account/client-accounts/individual", data);
	},

	async createClientWallet(data) {
		return apiService.post("/vopay/account/client-accounts/wallets/create", data);
	},

	async getClientWallets(clientAccountId) {
		return apiService.get(`/vopay/account/client-accounts/wallets/${clientAccountId}`);
	},

	async fundBankAccount(data) {
		return apiService.post("/vopay/account/fund-my-account", data);
	},

	async getLinkedBankAccounts(accountId) {
		return apiService.get(`/vopay/bank-account/${accountId}`);
	},

	async setDefaultBankAccount(data) {
		return apiService.post("/vopay/bank-account/set-my-bank-account", data);
	},

	async getDefaultBankAccount(accountId) {
		return apiService.get(`/vopay/bank-account/default-bank-account/${accountId}`);
	},

	async getBusinessAccountOnboardingLink(accountId) {
		return apiService.get(`/vopay/${accountId}`);
	},
	async getEmployeeBankEmbedUrl(clientAccountId) {
		return apiService.get(`/vopay/iq11/generate-embed-url/${clientAccountId}`);
	},

	async fundEmployerWallet(data) {
		return apiService.post("/vopay/eft/fund", data);
	},
};

export default VoPayService;
