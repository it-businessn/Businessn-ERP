/**
 * The support and affiliate pages close to the public website. They used
 * process.env.REACT_APP_WEBSITE, which CRA never exposes to the browser (only REACT_APP_*),
 * so the close buttons navigated to "/undefined".
 */
describe("WEBSITE_URL", () => {
	const original = process.env.REACT_APP_WEBSITE;
	afterEach(() => {
		if (original === undefined) delete process.env.REACT_APP_WEBSITE;
		else process.env.REACT_APP_WEBSITE = original;
		jest.resetModules();
	});

	test("C-WEB-01 uses REACT_APP_WEBSITE when it is set", () => {
		process.env.REACT_APP_WEBSITE = "https://example.test";
		jest.resetModules();
		const { WEBSITE_URL } = require("constant");
		expect(WEBSITE_URL).toBe("https://example.test");
	});

	test("C-WEB-02 falls back to the BusinessN site, never undefined", () => {
		delete process.env.REACT_APP_WEBSITE;
		jest.resetModules();
		const { WEBSITE_URL } = require("constant");
		expect(WEBSITE_URL).toBe("https://www.businessn.com");
	});
});
