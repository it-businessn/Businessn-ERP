import apiService from "services";

const NotesService = {
	async getNotesByContactId(id) {
		return apiService.get(`/notes/${id}`);
	},

	async addNote(data) {
		return apiService.post("/notes", data);
	},
};

export default NotesService;
