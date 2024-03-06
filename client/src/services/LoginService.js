import apiService from "services";

const LoginService = {
	async signIn(data) {
		return apiService.post("/user/login", data);
	},

	async signUp(data) {
		return apiService.post("/user/register", data);
	},

	async verifyUser(data) {
		return apiService.post("/verify-email", data);
	},
};

export default LoginService;
