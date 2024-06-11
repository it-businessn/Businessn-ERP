import apiService from "services";

const CommunicationService = {
	async getAllUserConversations(data) {
		return apiService.get(
			`/comms/all-conversations/${data.userId}/${data.company}`,
		);
	},

	async getGroupConversationById(id) {
		return apiService.get(`/comms/group-conversations/${id}/messages`);
	},

	async getGroupConversationByName(id) {
		return apiService.get(`/comms/group-conversations/${id}/messages`);
	},

	async getGroupConversation() {
		return apiService.get(`/comms/group-conversations`);
	},

	async createConversation(data) {
		return apiService.post("/conversations", data);
	},

	async createGroupMessages(data) {
		return apiService.post(`/comms/group-messages`, data);
	},

	async createGroupConversation(data) {
		return apiService.post(`/comms/group-conversations`, data);
	},

	async sendMessage(data) {
		return apiService.post("/conversations/messages", data);
	},

	async getAllConversation(id) {
		return apiService.get(`/conversations/${id}/messages`);
	},
	async messageHistory(data) {
		return apiService.post("/conversations/history", data);
	},

	async getTwoUsersConversation(data) {
		return apiService.post(`/comms/one-to-one-conversations/messages`, data);
	},
};

export default CommunicationService;
