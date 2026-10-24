import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { useState } from "react";
import SettingService from "services/SettingService";
import { CURRENT_YEAR } from "utils/convertDate";
import { StatHolidayTable } from ".";

jest.mock("services/SettingService", () => ({
	__esModule: true,
	default: { getStatHolidays: jest.fn(), deleteHoliday: jest.fn() },
}));

const Harness = () => {
	const [holidays, setHolidays] = useState([]);
	const [year, setYear] = useState(CURRENT_YEAR);
	return (
		<ChakraProvider>
			<StatHolidayTable
				holidays={holidays}
				setHolidays={setHolidays}
				currentCompany="Acme"
				handleEdit={() => {}}
				year={year}
				setYear={setYear}
			/>
		</ChakraProvider>
	);
};

test("C-HOL-01 the holiday list loads the chosen year (past, present or future)", async () => {
	SettingService.getStatHolidays.mockImplementation(async (company, year) => ({
		data: [{ _id: `h${year}`, name: `Canada Day ${year}`, date: `${year}-07-01T00:00:00.000Z` }],
	}));
	render(<Harness />);
	await waitFor(() => expect(SettingService.getStatHolidays).toHaveBeenCalledWith("Acme", CURRENT_YEAR));
	expect(await screen.findByText(`Canada Day ${CURRENT_YEAR}`)).toBeInTheDocument();

	const select = screen.getByRole("combobox", { name: "Year" });
	const years = within(select).getAllByRole("option").map((o) => Number(o.value));
	expect(years).toEqual([-3, -2, -1, 0, 1, 2, 3].map((d) => CURRENT_YEAR + d));

	fireEvent.change(select, { target: { value: String(CURRENT_YEAR + 1) } });
	await waitFor(() => expect(SettingService.getStatHolidays).toHaveBeenLastCalledWith("Acme", CURRENT_YEAR + 1));
	expect(await screen.findByText(`Canada Day ${CURRENT_YEAR + 1}`)).toBeInTheDocument();
	// shown in UTC: July 1 stays July 1 whatever the browser's time zone
	expect(screen.getByText(/Jul 01, /)).toBeInTheDocument();
});

test("C-HOL-02 a year outside the usual range (a holiday saved for it) is still shown in the picker", async () => {
	SettingService.getStatHolidays.mockResolvedValue({ data: [] });
	render(
		<ChakraProvider>
			<StatHolidayTable holidays={[]} setHolidays={() => {}} currentCompany="Acme" handleEdit={() => {}} year={CURRENT_YEAR + 9} setYear={() => {}} />
		</ChakraProvider>,
	);
	const select = screen.getByRole("combobox", { name: "Year" });
	expect(select).toHaveValue(String(CURRENT_YEAR + 9));
	await waitFor(() => expect(SettingService.getStatHolidays).toHaveBeenLastCalledWith("Acme", CURRENT_YEAR + 9));
});
