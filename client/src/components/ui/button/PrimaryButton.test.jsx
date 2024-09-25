import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PrimaryButton from "./PrimaryButton";

describe("PrimaryButton Component", () => {
	test("renders correctly with a name", () => {
		render(<PrimaryButton name="John" />);

		const titleElement = screen.getByText("John");
		expect(titleElement).toBeInTheDocument();
	});
});
