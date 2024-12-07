import { API } from "api";

const withAuthHeader = {
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
};

// Authentication APIs
// export const signIn = (formData) => API.post("/user/login", formData);
// export const signUp = (formData) => API.post("/user/register", formData);
// export const verifyUser = (formData) => API.post("/verify-email", formData);
// export const forgotPassword = (formData) =>
// 	API.post("/forgot-password", formData);
// export const signOut = () => API.post("/logout");
// export const updateUserProfile = (formData, id) =>
// 	API.put(`/user/${id}`, formData);
// export const updateUserPassword = (formData, id) =>
// 	API.put(`/user/change-password/${id}`, formData);

// export const getContacts = () => API.get("/contacts");
// export const getContactDetailsById = (id) => API.get(`/contacts/${id}`);
// export const getNotifications = () => API.get("/notifications");
// export const addContact = (formData) => API.post("/contacts", formData);

// export const getIndustryType = () => API.get(`/contacts/industry-type`);
// export const addIndustryType = (formData) =>
// 	API.post("/contacts/industry-type", formData);
// export const getIndustryType = (id) => API.get(`/contacts/industry-type${id}`);
// export const updateIndustryType = (formData, id) =>
//   API.put(`/contacts/industry-type${id}`, formData);

// export const updateContact = (formData, id) =>
// 	API.put(`/contacts/${id}`, formData);

// export const getEvents = () => API.get("/events");
// export const addEvent = (formData) => API.post("/events", formData);
// export const updateEvent = (formData, id) => API.put(`/events/${id}`, formData);

// export const getActivities = () => API.get("/activities");
// export const getActivitiesByContactId = (id) => API.get(`/activities/${id}`);
// export const addActivity = (formData) => API.post("/activities", formData);

// export const getTasks = () => API.get("/tasks");
// export const getTaskByContactId = (id) => API.get(`/tasks/${id}`);
// export const addTask = (formData) => API.post("/tasks", formData);
// export const updateTask = (formData, id) => API.put(`/tasks/${id}`, formData);

// export const getMeetingsByContactId = (id) => API.get(`/meetings/${id}`);
// export const addMeeting = (formData) => API.post("/meetings", formData);

// export const getNotes = () => API.get("/notes");
// export const getNotesByContactId = (id) => API.get(`/notes/${id}`);
// export const addNote = (formData) => API.post("/notes", formData);

// export const getOpportunities = () => API.get("/opportunities");
// export const getOpportunitiesByCategory = () =>
// 	API.get("/opportunities/category");
// export const addOpportunity = (formData) =>
// 	API.post("/opportunities", formData);
// export const updateOpportunity = (formData, id) =>
// 	API.put(`/opportunities/${id}`, formData);

// export const getConfigurationsByName = (name) =>
// 	API.get(`/configuration/${name}`);

// export const updateUserById = (id, formData, token) =>
// 	API.put(`/employee/${id}`, formData, withAuthHeader(token));

//Resources
// export const getResources = () => API.get("/resources");
// export const getResourcesByType = (fileType) =>
// 	API.get(`/resources/${fileType}`);
// export const upload = (formData) => API.post("/resources/upload", formData);
// export const download = (id) => API.get(`/resources/download/${id}`);

const generateTimestamp = () => Math.floor(Date.now() / 1000); // Current time in seconds
const timestamp = generateTimestamp();
const expirationTime = timestamp + 300; // 5 minutes = (5 * 60seconds per minute)

export const BASE_URL = process.env.REACT_APP_BASE_URL;

const buildURL = (path) => {
	const url = new URL(BASE_URL);
	url.pathname += path;

	url.searchParams.set("timestamp", timestamp);
	url.searchParams.set("expirationTime", expirationTime);
	return url.href;
};

const fetchData = async (path, params) => {
	return API.get(buildURL(path), withAuthHeader);
	// return await (await fetch(url.href)).json();
};

const postData = async (path, data) => {
	return API.post(buildURL(path), data, withAuthHeader);
};

const putData = async (path, data, id, token) => {
	return token
		? API.put(buildURL(path), data, withAuthHeader(token))
		: API.put(buildURL(path), data, withAuthHeader);
};

const deleteData = async (path, data) => {
	return API.delete(buildURL(path), data);
};

const apiService = {
	async get(path, searchParams) {
		return fetchData(path, searchParams);
	},

	async post(path, data) {
		return postData(path, data);
	},

	async put(path, data, id, token) {
		return putData(path, data, id, token);
	},

	async delete(path, data, id, token) {
		return deleteData(path, data, id, token);
	},
};

export default apiService;
