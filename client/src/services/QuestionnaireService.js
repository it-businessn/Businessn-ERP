import apiService from "services";

const QuestionnaireService = {
	async getQuestionnaires() {
		return apiService.get("/questionnaire");
	},

	async getAssessmentByUserId(id) {
		return apiService.get(`/questionnaire/assessment/${id}`);
	},

	async addAssessmentStatus(data) {
		return apiService.post(`/questionnaire/assessment`, data);
	},

	async updateAssessmentStatus(data, id) {
		return apiService.put(`/questionnaire/assessment/${id}`, data, id);
	},

	async addQuestionnaire(data) {
		return apiService.post("/questionnaire/", data);
	},

	async deleteResource(data, id) {
		return apiService.delete(`/questionnaire/${id}`, data, id);
	},
};

export default QuestionnaireService;
