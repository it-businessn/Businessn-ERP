import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TextTitle from "./TextTitle";

describe("TextTitle Component", () => {
	test("renders correctly with a title", () => {
		render(<TextTitle title="John" />);

		const titleElement = screen.getByText("John");
		expect(titleElement).toBeInTheDocument();
	});

	// test("renders correctly without a name", () => {
	// 	render(<TextTitle />);

	// 	// Check if the component renders "Hello, Guest!" when no name is provided
	// 	const guestGreeting = screen.getByText("Hello, Guest!");
	// 	expect(guestGreeting).toBeInTheDocument();
	// });
});
