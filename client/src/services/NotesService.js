import apiService from "services";

const NotesService = {
	async getNotesByContactId(id) {
		return apiService.get(`/notes/${id}`);
	},

	async addNote(data) {
		return apiService.post("/notes", data);
	},

	async updateNotes(data, id) {
		return apiService.put(`/notes/${id}`, data, id);
	},
};

export default NotesService;
