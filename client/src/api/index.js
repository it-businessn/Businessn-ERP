import axios from "axios";
import LoginService from "services/LoginService";

export const API = axios.create({
	baseURL: process.env.REACT_APP_BASE_URL,
});

// Add access token to headers
API.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("accessToken");
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

export const setupAxiosInterceptors = (setSessionExpired) => {
	API.interceptors.response.use(
		(response) => response,
		async (error) => {
			const originalRequest = error.config;

			if (error.response.status === 403 && !originalRequest._retry) {
				originalRequest._retry = true; // Prevent infinite retry loop

				try {
					const { data } = await LoginService.refresh({
						refreshToken: localStorage.getItem("refreshToken"),
					});
					const { accessToken } = data;
					localStorage.setItem("accessToken", accessToken);
					originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
					return API(originalRequest);
				} catch (refreshError) {
					console.error("Refresh token invalid or expired", refreshError);
					// setSessionExpired(true);
					localStorage.removeItem("accessToken");
					localStorage.removeItem("refreshToken");
					window.location.href = "/login";
				}
			}

			return Promise.reject(error);
		},
	);
};
