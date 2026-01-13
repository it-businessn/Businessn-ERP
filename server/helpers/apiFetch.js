export async function apiFetch(url, { method = "GET", data, headers = {} } = {}) {
	const options = {
		method,
		headers: {
			Accept: "application/json",
			...headers,
		},
	};

	if (method === "POST" && data) {
		options.headers["Content-Type"] = "application/x-www-form-urlencoded";
		options.body = new URLSearchParams(data).toString();
	}

	if (method === "GET" && data) {
		url += `?${new URLSearchParams(data)}`;
	}

	const response = await fetch(url, options);

	if (!response.ok) {
		const errorBody = await response.text();
		throw new Error(`${method} ${url} failed (${response.status}): ${errorBody}`);
	}

	return response.json();
}
