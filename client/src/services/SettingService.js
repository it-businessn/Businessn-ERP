import apiService from "services";

const SettingService = {
	async getConfigurationsByName(id) {
		return apiService.get(`/configuration/${id}`);
	},
};

export default SettingService;
