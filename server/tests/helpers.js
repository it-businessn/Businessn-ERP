const { generateAccessToken } = require("../middleware/auth");

const USER_ID = "64a000000000000000000001";
const OTHER_ID = "64a000000000000000000002";

const tokenFor = (id = USER_ID, fullName = "Test User") => generateAccessToken({ id, fullName });

const auth = (id) => ({ Authorization: `Bearer ${tokenFor(id)}` });

/** Minimal chainable Mongoose-query stub: resolves to `value`. */
const query = (value) => {
	const q = {
		select: () => q,
		sort: () => q,
		lean: () => q,
		populate: () => q,
		skip: () => q,
		limit: () => q,
		then: (res, rej) => Promise.resolve(value).then(res, rej),
		catch: (rej) => Promise.resolve(value).catch(rej),
	};
	return q;
};

const buildTestApp = () => {
	const { buildApp } = require("../app");
	return buildApp({ emit: jest.fn() });
};

module.exports = { USER_ID, OTHER_ID, tokenFor, auth, query, buildTestApp };
