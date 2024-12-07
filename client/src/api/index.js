import axios from "axios";
import apiService from "services";

export const API = axios.create({
	baseURL: process.env.REACT_APP_BASE_URL,
});

const refreshToken = async () => {
	try {
		const response = await apiService.post(`/refresh`, {
			token: localStorage.getItem("refreshToken"),
		});
		const { accessToken } = response.data;

		localStorage.setItem("accessToken", accessToken);
		API.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

		return accessToken;
	} catch (error) {
		console.error("Failed to refresh token", error);
		throw error;
	}
};

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

			if (error.response.status === 401 && !originalRequest._retry) {
				originalRequest._retry = true; // Prevent infinite retry loop

				try {
					const newAccessToken = await refreshToken();
					originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
					return API(originalRequest); // Retry the original request
				} catch (err) {
					console.error("Automatic token refresh failed", err);
					setSessionExpired(true);
					return Promise.reject(err);
				}
			}

			return Promise.reject(error);
		},
	);
};
