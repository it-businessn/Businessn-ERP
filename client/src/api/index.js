import axios from "axios";

export const API = axios.create({
	baseURL: process.env.REACT_APP_BASE_URL,
});

export const setupAxiosInterceptors = (setSessionExpired) => {
	API.interceptors.response.use(
		(response) => response,
		(error) => {
			if (error.response && error.response.status === 401) {
				setSessionExpired(true);
			}
			return Promise.reject(error);
		},
	);
};
