import { ChakraProvider, Tbody, Td, Tr } from "@chakra-ui/react";
import { act, fireEvent, render, renderHook, screen, within } from "@testing-library/react";
import TableLayout from "components/ui/table/TableLayout";
import useSortableData, { compareValues, sortRows } from "./useSortableData";

const rows = [
	{ name: "Item 10", amount: "$1,200.00", date: "2026-03-01", emp: { fullName: "Zoe" } },
	{ name: "item 2", amount: "$95.50", date: "2026-01-15", emp: { fullName: "adam" } },
	{ name: "Item 1", amount: "-$20.00", date: "", emp: null },
	{ name: "Bravo", amount: null, date: "2025-12-31T08:00:00.000Z", emp: { fullName: "Mia" } },
];
const names = (list) => list.map((r) => r.name);

test("TS-01 text sorts naturally and ignores case", () => {
	expect(names(sortRows(rows, { key: "name", direction: "asc" }))).toEqual(["Bravo", "Item 1", "item 2", "Item 10"]);
});

test("TS-02 amounts sort as numbers (minus sign kept); empty values always last", () => {
	expect(names(sortRows(rows, { key: "amount", direction: "asc" }))).toEqual(["Item 1", "item 2", "Item 10", "Bravo"]);
	expect(names(sortRows(rows, { key: "amount", direction: "desc" }))).toEqual(["Item 10", "item 2", "Item 1", "Bravo"]);
});

test("TS-03 dates sort by time; dotted paths and functions work", () => {
	expect(names(sortRows(rows, { key: "date", direction: "asc" }))).toEqual(["Bravo", "item 2", "Item 10", "Item 1"]);
	expect(names(sortRows(rows, { key: "emp.fullName", direction: "asc" }))).toEqual(["item 2", "Bravo", "Item 10", "Item 1"]);
	expect(names(sortRows(rows, { key: (r) => r.name.length, direction: "desc" }))[0]).toBe("Item 10");
	expect(compareValues(2, 10)).toBeLessThan(0);
});

test("TS-04 click order: ascending, descending, original; the input is not changed", () => {
	const copy = [...rows];
	const { result } = renderHook(() => useSortableData(rows));
	act(() => result.current.requestSort("name"));
	expect(result.current.sortConfig).toEqual({ key: "name", direction: "asc" });
	act(() => result.current.requestSort("name"));
	expect(result.current.sortConfig.direction).toBe("desc");
	act(() => result.current.requestSort("name"));
	expect(result.current.sortedItems).toBe(rows);
	expect(rows).toEqual(copy);
});

const Table = () => {
	const { sortedItems, sortConfig, requestSort } = useSortableData(rows);
	return (
		<ChakraProvider>
			<TableLayout cols={["Name", "Amount", "Action"]} sortKeys={{ Name: "name", Amount: "amount" }} sortConfig={sortConfig} onSort={requestSort}>
				<Tbody>
					{sortedItems.map((r) => (
						<Tr key={r.name}>
							<Td>{r.name}</Td>
							<Td>{r.amount}</Td>
							<Td />
						</Tr>
					))}
				</Tbody>
			</TableLayout>
		</ChakraProvider>
	);
};

test("TS-05 TableLayout: clicking or pressing Enter on a header sorts; unsortable columns stay plain", () => {
	render(<Table />);
	const header = screen.getByRole("columnheader", { name: /Amount/ });
	expect(header).toHaveAttribute("aria-sort", "none");
	fireEvent.click(header);
	expect(header).toHaveAttribute("aria-sort", "ascending");
	const firstRow = () => within(screen.getAllByRole("row")[1]).getAllByRole("cell")[0].textContent;
	expect(firstRow()).toBe("Item 1");
	fireEvent.keyDown(header, { key: "Enter" });
	expect(header).toHaveAttribute("aria-sort", "descending");
	expect(firstRow()).toBe("Item 10");
	expect(screen.getByRole("columnheader", { name: "Action" })).not.toHaveAttribute("aria-sort");
});
