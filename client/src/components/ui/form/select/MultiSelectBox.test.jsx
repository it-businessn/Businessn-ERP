import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import MultiSelectBox from "./MultiSelectBox";
import PayrollMultiSelectBox from "./PayrollMultiSelectBox";

const Harness = ({ Box = MultiSelectBox, data, initial = [], ...props }) => {
	const [selectedOptions, setSelectedOptions] = useState(initial);
	return (
		<ChakraProvider>
			<Box
				openMenu
				data={data}
				handleCloseMenu={() => {}}
				handleApply={() => {}}
				selectedOptions={selectedOptions}
				setSelectedOptions={setSelectedOptions}
				{...props}
			/>
			<span data-testid="selected">{selectedOptions.map(String).join("|")}</span>
		</ChakraProvider>
	);
};

const EMPLOYEES = [
	{ _id: "1", fullName: "Luis Izquierdo" },
	{ _id: "2", fullName: "Nicholas Foster" },
];
const row = (name) =>
	screen
		.getAllByText(name)
		.map((el) => el.closest(".chakra-menu__menuitem"))
		.find(Boolean);
const checked = (name) => row(name).querySelector("input[type=checkbox]").checked;
const selected = () => screen.getByTestId("selected").textContent;

test("C-MSB-01 clicking the row, the name or the box checks and unchecks the item", () => {
	render(<Harness data={EMPLOYEES} />);
	fireEvent.click(row("Luis Izquierdo"));
	expect(selected()).toBe("Luis Izquierdo");
	expect(checked("Luis Izquierdo")).toBe(true);
	fireEvent.click(row("Nicholas Foster").querySelector(".chakra-checkbox__label"));
	expect(checked("Nicholas Foster")).toBe(true);
	fireEvent.click(row("Luis Izquierdo").querySelector(".chakra-checkbox__control"));
	expect(selected()).toBe("Nicholas Foster");
	expect(checked("Luis Izquierdo")).toBe(false);
});

test("C-MSB-02 options already selected show as checked when the list opens", () => {
	render(<Harness data={EMPLOYEES} initial={["Nicholas Foster"]} />);
	expect(checked("Nicholas Foster")).toBe(true);
	expect(checked("Luis Izquierdo")).toBe(false);
});

test("C-MSB-03 plain string options are selected by their own value (was: undefined)", () => {
	render(<Harness data={["Admin", "Payroll"]} />);
	fireEvent.click(row("Payroll"));
	expect(selected()).toBe("Payroll");
	expect(checked("Payroll")).toBe(true);
});

test("C-MSB-04 timesheet filter (type): the selected value is the one shown as checked", () => {
	const depts = [
		{ _id: "d1", name: "Dept A", code: "A1" },
		{ _id: "d2", name: "Dept B", code: "B1" },
	];
	render(<Harness Box={PayrollMultiSelectBox} data={depts} type="code" />);
	fireEvent.click(row("A1"));
	expect(selected()).toBe("A1");
	expect(checked("A1")).toBe(true);
	expect(checked("B1")).toBe(false);
});

test("C-MSB-05 the app theme defines the facebook palette the checkboxes use (else a ticked box is invisible)", () => {
	const theme = require("config/themeConfig").default;
	expect(theme.colors.facebook[500]).toBe("#385898");
	expect(theme.colors.facebook[600]).toBe("#314E89");
});
