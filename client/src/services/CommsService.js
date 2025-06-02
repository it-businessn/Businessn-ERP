import apiService from "services";

const CommunicationService = {
	async createConversation(data) {
		return apiService.post("/conversations", data);
	},

	async getAnnouncement(id) {
		return apiService.get(`/announcements/${id}`);
	},

	async addAnnouncement(data) {
		return apiService.post("/announcements", data);
	},

	async getUserConversations(data) {
		return apiService.get(`/conversations/${data.userId}/${data.company}`);
	},

	async getGroupMessages(id) {
		return apiService.get(`/conversations/group/${id}/messages`);
	},

	async getOneToOneConversation(data) {
		return apiService.post(`/conversations/one-to-one/messages`, data);
	},

	async createGroupMessages(data) {
		return apiService.post(`/conversations/group/messages`, data);
	},

	async createOneToOneMessages(data) {
		return apiService.post("/conversations/messages", data);
	},

	async getAllGroupMessages() {
		return apiService.get(`/conversations/group`);
	},

	async getMessage(id) {
		return apiService.get(`/conversations/${id}/messages`);
	},

	async getConversationHistory(data) {
		return apiService.post("/conversations/history", data);
	},

	async createGroupConversation(data) {
		return apiService.post(`/conversations/group`, data);
	},
};

export default CommunicationService;
