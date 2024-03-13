import apiService from "services";

const SettingService = {
	async getConfigurationsByName(id) {
		return apiService.get(`/configuration/${id}`);
	},

	async getIdleLeadReAssignment() {
		return apiService.get("/set-up/idle-lead-config");
	},

	async setUpIdleLeadReAssignment(data) {
		return apiService.post("/set-up/idle-lead", data);
	},

	async updateSetUpIdleLeadReAssignment(data, id) {
		return apiService.put(`/set-up/idle-lead/${id}`, data, id);
	},
};

export default SettingService;
