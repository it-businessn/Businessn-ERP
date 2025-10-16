import apiService from "services";

const VoPayService = {
	async getPartnerDetails() {
		return apiService.get("/vopay");
	},

	async getOnboardingLink(accountId) {
		return apiService.get(`/vopay/${accountId}`);
	},

	async addPartner(data) {
		return apiService.post("/vopay", data);
	},
};

export default VoPayService;
