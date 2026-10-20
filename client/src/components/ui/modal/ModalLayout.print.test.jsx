import { ChakraProvider } from "@chakra-ui/react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { useReactToPrint } from "react-to-print";
import ModalLayout from "./ModalLayout";

jest.mock("react-to-print", () => ({ useReactToPrint: jest.fn(() => jest.fn()) }));
// jsdom's selector engine rejects react-focus-lock's tabbable query; the lock
// is irrelevant to printing, so neutralise it.
jest.mock("react-focus-lock", () => ({ __esModule: true, default: ({ children }) => children }));

const renderReport = () =>
	render(
		<ChakraProvider>
			<ModalLayout isOpen onClose={() => {}} title="Pay stub" isReport fileName="stub.pdf">
				<div>body</div>
			</ModalLayout>
		</ChakraProvider>,
	);

beforeEach(() => {
	jest.useFakeTimers();
	useReactToPrint.mockClear();
});
afterEach(() => jest.useRealTimers());

test("C-PRINT-01 hook receives the react-to-print v3 options", () => {
	renderReport();
	const opts = useReactToPrint.mock.calls.at(-1)[0];
	expect(opts.contentRef).toHaveProperty("current");
	expect(opts.content).toBeUndefined();
	expect(opts.onBeforeGetContent).toBeUndefined();
	expect(opts.documentTitle).toBe("stub.pdf");
	expect(opts.pageStyle).toMatch(/\.print-root[^}]*overflow: visible/);
	// the printed node must carry the class the pageStyle targets
	expect(document.querySelector(".print-root")).not.toBeNull();
});

test("C-PRINT-02 print icon triggers print and stays usable after the print finishes", () => {
	const handlePrint = jest.fn();
	useReactToPrint.mockImplementation(() => handlePrint);
	renderReport();
	const btn = screen.getByLabelText("Print");
	expect(btn).toBeEnabled();

	fireEvent.click(btn);
	act(() => jest.advanceTimersByTime(1000));
	expect(handlePrint).toHaveBeenCalledTimes(1);

	// simulate the browser dialog closing (library callback)
	const opts = useReactToPrint.mock.calls.at(-1)[0];
	act(() => opts.onAfterPrint());

	// previously the button disabled itself permanently after the first click
	expect(screen.getByLabelText("Print")).toBeEnabled();
	fireEvent.click(screen.getByLabelText("Print"));
	act(() => jest.advanceTimersByTime(1000));
	expect(handlePrint).toHaveBeenCalledTimes(2);
});
