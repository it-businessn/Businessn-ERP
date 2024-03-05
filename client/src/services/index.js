import { API } from "api";

const withAuthHeader = (token) => ({
	headers: {
		Authorization: `Bearer ${token}`,
	},
});

// Authentication APIs
export const signIn = (formData) => API.post("/user/login", formData);
export const signUp = (formData) => API.post("/user/register", formData);
export const verifyUser = (formData) => API.post("/verify-email", formData);
export const forgotPassword = (formData) =>
	API.post("/forgot-password", formData);
export const signOut = () => API.post("/logout");
export const updateUserProfile = (formData, id) =>
	API.put(`/user/${id}`, formData);
export const updateUserPassword = (formData, id) =>
	API.put(`/user/change-password/${id}`, formData);

export const getContacts = () => API.get("/contacts");
export const getContactDetailsById = (id) => API.get(`/contacts/${id}`);
export const getNotifications = () => API.get("/notifications");
export const addContact = (formData) => API.post("/contacts", formData);

export const getIndustryType = () => API.get(`/contacts/industry-type`);
export const addIndustryType = (formData) =>
	API.post("/contacts/industry-type", formData);
// export const getIndustryType = (id) => API.get(`/contacts/industry-type${id}`);
// export const updateIndustryType = (formData, id) =>
//   API.put(`/contacts/industry-type${id}`, formData);

export const updateContact = (formData, id) =>
	API.put(`/contacts/${id}`, formData);

export const getEvents = () => API.get("/events");
export const addEvent = (formData) => API.post("/events", formData);
export const updateEvent = (formData, id) => API.put(`/events/${id}`, formData);

export const getActivities = () => API.get("/activities");
export const getActivitiesByContactId = (id) => API.get(`/activities/${id}`);
export const addActivity = (formData) => API.post("/activities", formData);

export const getTasks = () => API.get("/tasks");
export const getTaskByContactId = (id) => API.get(`/tasks/${id}`);
export const addTask = (formData) => API.post("/tasks", formData);
export const updateTask = (formData, id) => API.put(`/tasks/${id}`, formData);

export const getMeetingsByContactId = (id) => API.get(`/meetings/${id}`);
export const addMeeting = (formData) => API.post("/meetings", formData);

export const getNotes = () => API.get("/notes");
export const getNotesByContactId = (id) => API.get(`/notes/${id}`);
export const addNote = (formData) => API.post("/notes", formData);

export const getOpportunities = () => API.get("/opportunities");
export const getOpportunitiesByCategory = () =>
	API.get("/opportunities/category");
export const addOpportunity = (formData) =>
	API.post("/opportunities", formData);
export const updateOpportunity = (formData, id) =>
	API.put(`/opportunities/${id}`, formData);

export const getConfigurationsByName = (name) =>
	API.get(`/configuration/${name}`);

export const updateUserById = (id, formData, token) =>
	API.put(`/employee/${id}`, formData, withAuthHeader(token));

//Resources
export const getResources = () => API.get("/resources");
export const getResourcesByType = (fileType) =>
	API.get(`/resources/${fileType}`);
export const upload = (formData) => API.post("/resources/upload", formData);
export const download = (id) => API.get(`/resources/download/${id}`);
