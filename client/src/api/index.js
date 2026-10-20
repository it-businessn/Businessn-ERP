import axios from "axios";
import LocalStorageService from "services/LocalStorageService";
import LoginService from "services/LoginService";

export const API = axios.create({
	baseURL: process.env.REACT_APP_BASE_URL,
});

// Add access token to all outgoing requests
API.interceptors.request.use(
	(config) => {
		const token = sessionStorage.getItem("accessToken");
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		// FIX: Was missing `return` before Promise.reject — errors were swallowed silently
		return Promise.reject(error);
	},
);

let refreshPromise = null;

/**
 * Decide whether a failed response should trigger a token refresh.
 * Only an *authentication* 403 (expired/invalid access token) qualifies.
 * Authorization failures (e.g. COMPANY_ACCESS_DENIED) also use 403 and must
 * surface to the caller untouched. Servers that predate the `code` field send
 * no code, so "no code" is treated as a token error for backward compatibility.
 */
export const shouldAttemptRefresh = (error) => {
	const status = error?.response?.status;
	const code = error?.response?.data?.code;
	const isTokenError = !code || code === "TOKEN_INVALID" || code === "TOKEN_MISSING";
	return status === 403 && isTokenError && !error?.config?._retry;
};

export const setupAxiosInterceptors = (setSessionExpired) => {
	API.interceptors.response.use(
		(response) => response,
		async (error) => {
			const originalRequest = error.config;

			if (shouldAttemptRefresh(error)) {
				originalRequest._retry = true;

				try {
					// Deduplicate concurrent refresh calls
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
					console.error("Token refresh failed:", refreshError?.message);
					// Show session expired banner instead of abrupt redirect
					if (setSessionExpired) {
						setSessionExpired(true);
					} else {
						redirectLogin();
					}
					return Promise.reject(refreshError);
				}
			}

			// For non-403 errors or already-retried requests
			if (error?.response?.status === 401) {
				// Token missing or invalid — redirect to login
				redirectLogin();
			}

			return Promise.reject(error);
		},
	);
};

export const redirectLogin = () => {
	sessionStorage.clear();
	sessionStorage.removeItem("accessToken");
	LocalStorageService.clear();
	window.location.replace("/login");
};
