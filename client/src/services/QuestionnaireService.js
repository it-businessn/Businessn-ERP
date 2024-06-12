import apiService from "services";

const QuestionnaireService = {
	async getQuestionnaires() {
		return apiService.get("/questionnaire");
	},

	async getAssessmentByUserId(id) {
		return apiService.get(`/questionnaire/assessment/${id}`);
	},

	async getAssessmentTypes(company) {
		return apiService.get(`/questionnaire/assessment/type/comp/${company}`);
	},

	async getAssessmentByType(data) {
		return apiService.get(
			`/questionnaire/assessment/type/company/${data.type}/${data.company}`,
		);
	},

	async addAssessmentType(data) {
		return apiService.post(`/questionnaire/assessment/type`, data);
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

	async updateQuestionnaire(data, id) {
		return apiService.put(`/questionnaire/${id}`, data, id);
	},

	async deleteQuestion(data, id) {
		return apiService.delete(`/questionnaire/${id}`, data, id);
	},
};

export default QuestionnaireService;
