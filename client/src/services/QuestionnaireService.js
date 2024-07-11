import apiService from "services";

const QuestionnaireService = {
	async getQuestionnaires() {
		return apiService.get("/questionnaire");
	},

	async getSubjectQuestionnaire(data) {
		return apiService.get(
			`/questionnaire/subject/${data.type}/${data.company}`,
		);
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
