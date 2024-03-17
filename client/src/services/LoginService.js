import apiService from "services";

const LoginService = {
	async signIn(data) {
		return apiService.post("/login", data);
	},

	async createEmployee(data) {
		return apiService.post("/signup", data);
	},
};

export default LoginService;
