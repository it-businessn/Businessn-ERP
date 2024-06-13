import apiService from "services";

const LoginService = {
	async signIn(data) {
		return apiService.post("/login", data);
	},

	async signOut(id) {
		return apiService.get(`/logout/${id}`);
	},

	async createEmployee(data) {
		return apiService.post("/signup", data);
	},
};

export default LoginService;
