import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Button from "./Button";

describe("Button Component", () => {
	test("renders with default label", () => {
		const { getByText } = render(<Button onClick={() => {}} />);
		// eslint-disable-next-line testing-library/prefer-screen-queries
		expect(getByText("Click me")).toBeInTheDocument();
	});

	test("renders with provided label", () => {
		const { getByText } = render(<Button label="Submit" onClick={() => {}} />);
		// eslint-disable-next-line testing-library/prefer-screen-queries
		expect(getByText("Submit")).toBeInTheDocument();
	});

	test("calls onClick prop when clicked", () => {
		const handleClick = jest.fn();
		const { getByText } = render(
			<Button label="Submit" onClick={handleClick} />,
		);
		// eslint-disable-next-line testing-library/prefer-screen-queries
		fireEvent.click(getByText("Submit"));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});
});
