import apiService from "services";

const VoPayService = {
	async addPartnerEmployer(data) {
		return apiService.post("/vopay/partner/account", data);
	},

	async getPartnerEmployerAccounts() {
		return apiService.get("/vopay/partner/account");
	},

	async getClientEmployees() {
		return apiService.get("/vopay/account/client-accounts");
	},

	async getOnboardingLink(accountId) {
		return apiService.get(`/vopay/${accountId}`);
	},

	async createClientEmployee(data) {
		return apiService.post("/vopay/account/client-accounts/individual", data);
	},

	async getEmployeeBankEmbedUrl(clientAccountId) {
		return apiService.get(`/vopay/iq11/generate-embed-url/${clientAccountId}`);
	},

	async fundEmployerWallet(data) {
		return apiService.post("/vopay/eft/fund", data);
	},
};

export default VoPayService;
