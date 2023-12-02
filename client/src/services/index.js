import { API } from "api";

const withAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Authentication APIs
export const signIn = (formData) => API.post("/login", formData);
export const signUp = (formData) => API.post("/register", formData);
export const verifyUser = (formData) => API.post("/verify-email", formData);
export const forgotPassword = (formData) =>
  API.post("/forgot-password", formData);
export const signOut = () => API.post("/logout");

export const getContacts = () => API.get("/contacts");
export const getNotifications = () => API.get("/notifications");

export const getActivities = () => API.get("/activities");
export const addActivity = (formData) => API.post("/activities", formData);

export const getTasks = () => API.get("/tasks");
export const addTask = (formData) => API.post("/tasks", formData);
export const updateTask = (formData, id) => API.put(`/tasks/${id}`, formData);

export const getNotes = () => API.get("/notes");
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
