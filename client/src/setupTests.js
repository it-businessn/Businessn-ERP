// jest-dom adds custom matchers such as toBeInTheDocument().
// CRA loads this file automatically before every test suite.
import "@testing-library/jest-dom";

// jsdom lacks matchMedia; Chakra's Logo/breakpoint hooks call it.
if (!window.matchMedia) {
	window.matchMedia = (query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
	});
}
