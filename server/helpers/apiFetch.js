// FIX (AUD-020): this file used ESM `export` inside a CommonJS project. It only
// loads on Node >= 22.12 (require(esm)); on Node 18/20 (allowed by package.json
// "engines") and under Jest it throws "Must use import to load ES Module".
async function apiFetch(url, { method = "GET", data, headers = {} } = {}) {
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

module.exports = { apiFetch };
