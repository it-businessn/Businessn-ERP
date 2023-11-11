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

// User APIs
export const getAllUsers = (token) =>
  API.get("/employee", withAuthHeader(token));
export const getUserById = (id, token) =>
  API.get(`/employee/${id}`, withAuthHeader(token));
export const getUserByRole = (queryParams, token) =>
  API.get(`/employee/role?${queryParams}`, withAuthHeader(token));
export const updateUserById = (id, formData, token) =>
  API.put(`/employee/${id}`, formData, withAuthHeader(token));
export const updateUserBankDetailsById = (id, formData, token) =>
  API.post(`/employee/bank/${id}`, formData, withAuthHeader(token));

// Attendance APIs
export const getAttendanceDetails = (token) =>
  API.get("/attendance", withAuthHeader(token));
export const updateAttendanceDetailsById = (id, formData, token) =>
  API.put(`/attendance/${id}`, formData, withAuthHeader(token));
export const addUserAttendanceDetailsById = (id, formData, token) =>
  API.post(`/attendance/${id}`, formData, withAuthHeader(token));

// Leave Request APIs
export const raiseLeaveRequest = (id, formData, token) =>
  API.post(`/leave-requests/submit/${id}`, formData, withAuthHeader(token));
export const getLeaveRequest = (token) =>
  API.get("/leave-requests", withAuthHeader(token));
export const updateLeaveRequestDetailsById = (id, formData, token) =>
  API.put(`/leave-requests/${id}`, formData, withAuthHeader(token));

// Payslip APIs
export const getPayslip = (token) =>
  API.get("/payslips", withAuthHeader(token));
export const getPayslipByCategory = (token) =>
  API.get("/payslips/category", withAuthHeader(token));
export const generatePayslip = (formData, token) =>
  API.post("/payslips/generate/", formData, withAuthHeader(token));

// Payroll APIs
export const getPayroll = (token) => API.get("/payroll", withAuthHeader(token));
export const getPayrollByCategory = (token) =>
  API.get("/payroll/category", withAuthHeader(token));

export const processPayroll = (formData, token) =>
  API.post("/payroll", formData, withAuthHeader(token));

export const addUserPaymentDetailsById = (id, formData) =>
  API.post(`/userOperation/payment/${id}`, formData);

// Tax APIs
export const getFederalTaxById = (id, token) =>
  API.get(`/tax/${id}`, withAuthHeader(token));
export const getPayrollData = (token) => API.get("/tax", withAuthHeader(token));

//Dashboard APIs
export const getDashboardSummary = (token) =>
  API.get("/dashboard", withAuthHeader(token));

//Notification APIs
export const getNotifications = (token) =>
  API.get(`/notification`, withAuthHeader(token));

export const getNotificationByDate = (date, token) =>
  API.get(`/notification/${date}`, withAuthHeader(token));

//Configuration APIs
export const getConfigurations = (token) =>
  API.get("/configuration", withAuthHeader(token));
export const getConfigurationsByName = (name) =>
  API.get(`/configuration/${name}`);
export const addConfigurationItem = (token, formData, id) =>
  API.post(`/configuration/item/${id}`, formData, withAuthHeader(token));
export const updateConfigurationItem = (token, formData, id) =>
  API.put(`/configuration/item/${id}`, formData, withAuthHeader(token));
export const updateUserRole = (id, formData, token) =>
  API.put(`/configuration/role/${id}`, formData, withAuthHeader(token));
