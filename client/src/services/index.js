import { API } from "api";

const withAuthHeader = {
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
};

export const BASE_URL = process.env.REACT_APP_BASE_URL;

/**
 * Build a URL for API requests.
 * FIX: Only append page/limit params when they are actually provided.
 * Previously, every request got ?timestamp=...&expirationTime=...&page=undefined&limit=undefined
 * which polluted server logs and could cause unexpected query parsing.
 */
export const buildURL = (path, queryParams) => {
	const url = new URL(`${BASE_URL}${path}`);

	// Only add pagination params when explicitly provided
	if (queryParams?.page !== undefined) {
		url.searchParams.set("page", queryParams.page);
	}
	if (queryParams?.limit !== undefined) {
		url.searchParams.set("limit", queryParams.limit);
	}
	// Add any other query params that were passed
	if (queryParams) {
		Object.entries(queryParams).forEach(([key, val]) => {
			if (key !== "page" && key !== "limit" && val !== undefined) {
				url.searchParams.set(key, val);
			}
		});
	}

	return url.href;
};

const fetchData = async (path, queryParams, params, signal) => {
	return API.get(buildURL(path, queryParams), { params, signal });
};

const postData = async (path, data) => {
	return API.post(buildURL(path), data);
};

const putData = async (path, data, id, token) => {
	return token ? API.put(buildURL(path), data, withAuthHeader(token)) : API.put(buildURL(path), data);
};

const deleteData = async (path, data) => {
	return API.delete(buildURL(path), { data });
};

export const apiService = {
	async get(path, queryParams, searchParams, signal) {
		return fetchData(path, queryParams, searchParams, signal);
	},

	async post(path, data) {
		return postData(path, data);
	},

	async put(path, data, id, token) {
		return putData(path, data, id, token);
	},

	async delete(path, data, id, token) {
		return deleteData(path, data, id, token);
	},
};

export default apiService;
