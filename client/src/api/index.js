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
	(error) => {
		if (error.response?.status === 429) {
			alert("Too many requests — you have been logged out for security.");
			// redirectLogin();
		}
		Promise.reject(error);
	},
);

let refreshPromise = null;
export const setupAxiosInterceptors = (setSessionExpired) => {
	API.interceptors.response.use(
		(response) => response,
		async (error) => {
			const originalRequest = error.config;

			if (error?.response?.status === 403 && !originalRequest._retry) {
				originalRequest._retry = true;

				try {
					if (!refreshPromise) {
						refreshPromise = LoginService.refresh({
							refreshToken: localStorage.getItem("refreshToken"),
						}).finally(() => {
							refreshPromise = null;
						});
					}

					const { data } = await refreshPromise;

					const { accessToken } = data;

					sessionStorage.setItem("accessToken", accessToken);

					originalRequest.headers.Authorization = `Bearer ${accessToken}`;

					return API(originalRequest);
				} catch (refreshError) {
					console.error("Refresh error", refreshError);
					// setSessionExpired(true);
					redirectLogin();
				}
			} else {
				console.error("Refresh token invalid or expired", error);
				if (error?.response?.data?.message?.includes("token")) redirectLogin();
			}

			return Promise.reject(error);
		},
	);
};

export const redirectLogin = () => {
	window.location.replace(`/login`);
	sessionStorage.clear();
	sessionStorage.removeItem("accessToken");
	LocalStorageService.clear();
};
