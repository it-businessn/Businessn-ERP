import apiService from "services";

const VoPayService = {
	async getPartnerDetails() {
		return apiService.get("/vopay");
	},

	async addPartner(data) {
		return apiService.post("/vopay", data);
	},
};

export default VoPayService;
