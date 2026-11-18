import { ChakraProvider } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { RenderPriorityBars } from "./RenderPriorityBars";

test("BUG-PM-02 a task without a priority renders grey bars instead of crashing the list", () => {
	for (const p of [undefined, null, "", "High", "medium", "low"]) {
		const { container, unmount } = render(<ChakraProvider>{RenderPriorityBars(p)}</ChakraProvider>);
		expect(container.querySelectorAll("div").length).toBeGreaterThanOrEqual(3);
		unmount();
	}
});
