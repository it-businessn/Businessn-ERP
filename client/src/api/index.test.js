import { shouldAttemptRefresh } from "api";

const err = (status, data, retried = false) => ({ response: { status, data }, config: { _retry: retried } });

describe("shouldAttemptRefresh (AUD-017)", () => {
	test("C-API-01 403 with TOKEN_INVALID -> refresh", () => {
		expect(shouldAttemptRefresh(err(403, { code: "TOKEN_INVALID" }))).toBe(true);
	});
	test("C-API-02 403 without a code (legacy server) -> refresh", () => {
		expect(shouldAttemptRefresh(err(403, { message: "Invalid or expired token" }))).toBe(true);
	});
	test("C-API-03 403 COMPANY_ACCESS_DENIED -> no refresh", () => {
		expect(shouldAttemptRefresh(err(403, { code: "COMPANY_ACCESS_DENIED" }))).toBe(false);
	});
	test("C-API-04 403 FORBIDDEN (self-only action) -> no refresh", () => {
		expect(shouldAttemptRefresh(err(403, { code: "FORBIDDEN" }))).toBe(false);
	});
	test("C-API-05 already retried -> no second refresh", () => {
		expect(shouldAttemptRefresh(err(403, { code: "TOKEN_INVALID" }, true))).toBe(false);
	});
	test("C-API-06 401 / 500 / network error -> no refresh", () => {
		expect(shouldAttemptRefresh(err(401, { code: "TOKEN_MISSING" }))).toBe(false);
		expect(shouldAttemptRefresh(err(500, {}))).toBe(false);
		expect(shouldAttemptRefresh({ message: "Network Error" })).toBe(false);
	});
});
