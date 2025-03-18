import axios from "axios";
import LocalStorageService from "services/LocalStorageService";
import LoginService from "services/LoginService";

export const API = axios.create({
	baseURL: process.env.REACT_APP_BASE_URL,
});

// Add access token to headers
API.interceptors.request.use(
	(config) => {
		const token = sessionStorage.getItem("accessToken");
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

					sessionStorage.setItem("accessToken", accessToken);

					originalRequest.headers.Authorization = `Bearer ${accessToken}`;
					return API(originalRequest);
				} catch (refreshError) {
					console.error("Refresh token invalid or expired", refreshError);
					// setSessionExpired(true);
					window.location.href = "/login";

					sessionStorage.removeItem("accessToken");
					LocalStorageService.clear();
				}
			} else {
				console.error("Refresh token invalid or expired", error);
				if (error.response.data.message.includes("token")) window.location.href = "/login";
			}

			return Promise.reject(error);
		},
	);
};
