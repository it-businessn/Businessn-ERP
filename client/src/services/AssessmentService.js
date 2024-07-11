import apiService from "services";

const AssessmentService = {
	async getAssessmentByUserId(id) {
		return apiService.get(`/assessment/${id}`);
	},

	async getAssessmentTypes(company) {
		return apiService.get(`/assessment/type/${company}`);
	},

	async addAssessmentType(data) {
		return apiService.post(`/assessment/type`, data);
	},

	async addAssessmentStatus(data) {
		return apiService.post(`/assessment`, data);
	},

	async updateAssessmentStatus(data, id) {
		return apiService.put(`/assessment/${id}`, data, id);
	},

	async deleteAssessment(data, id) {
		return apiService.delete(`/assessment/${id}`, data, id);
	},
};

export default AssessmentService;
