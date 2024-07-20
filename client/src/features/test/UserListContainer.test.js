import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import UserListContainer from "./UserListContainer";

beforeEach(() => {
	global.fetch = jest.fn(() =>
		Promise.resolve({
			json: () =>
				Promise.resolve([
					{ id: 1, name: "John Doe" },
					{ id: 2, name: "Jane Smith" },
				]),
		}),
	);
});

afterEach(() => {
	global.fetch.mockClear();
});

describe("UserListContainer Component", () => {
	test("renders loading state initially", () => {
		render(<UserListContainer />);
		expect(screen.getByText("Loading...")).toBeInTheDocument();
	});

	test("renders user list after data fetch", async () => {
		render(<UserListContainer />);
		await screen.findByText("John Doe");
		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("Jane Smith")).toBeInTheDocument();
	});

	test("fetches users from API", async () => {
		render(<UserListContainer />);
		await screen.findByText("John Doe");
		expect(global.fetch).toHaveBeenCalledTimes(1);
		expect(global.fetch).toHaveBeenCalledWith(
			"https://jsonplaceholder.typicode.com/users",
		);
	});
});
