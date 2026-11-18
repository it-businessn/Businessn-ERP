import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { API } from "api";
import { SUPPORT_CATEGORY } from "constant";
import { TICKET_ACTION } from "erp-modules/payroll/timesheets/data";
import NoteDetails from "./NoteDetails";

jest.mock("api", () => ({ API: { get: jest.fn() } }));
// jsdom cannot run the Modal's focus trap; render the modal parts as plain boxes
jest.mock("@chakra-ui/react", () => {
	const actual = jest.requireActual("@chakra-ui/react");
	const Plain = ({ children }) => <div>{children}</div>;
	return {
		...actual,
		Modal: ({ isOpen, children }) => (isOpen ? <div>{children}</div> : null),
		ModalOverlay: () => null,
		ModalContent: Plain,
		ModalHeader: Plain,
		ModalBody: Plain,
		ModalCloseButton: () => null,
	};
});

const supportTicket = {
	_id: "t1",
	ticketNumber: "261118BusinessN#00042",
	category: SUPPORT_CATEGORY,
	status: TICKET_ACTION.OPEN,
	priority: 1,
	assignee: "Jesse C",
	clientFirstName: "Ana",
	clientLastName: "Lee",
	clientEmail: "ana@example.test",
	clientPhoneNumber: "604-555-0100",
	clientModeOfContact: "Email",
	inquiryType: "Payroll question",
	issue: "My pay stub is missing.",
	createdOn: "2026-11-17T18:00:00.000Z",
	ticketDaysOpened: 1,
	originalname: "stub.pdf",
};

const show = (data) =>
	render(
		<ChakraProvider>
			<NoteDetails isOpen setIsOpen={() => {}} data={data} />
		</ChakraProvider>,
	);

test("C-TD-01 a support-form ticket shows its details and the customer's contact", () => {
	show(supportTicket);
	expect(screen.getByText("Ticket #261118BusinessN#00042")).toBeInTheDocument();
	expect(screen.getByText("Payroll question")).toBeInTheDocument(); // title (no topic)
	expect(screen.getByText(TICKET_ACTION.OPEN)).toBeInTheDocument();
	expect(screen.getByText("Jesse C")).toBeInTheDocument();
	expect(screen.getAllByText("Ana Lee").length).toBeGreaterThan(0);
	expect(screen.getByText("ana@example.test")).toBeInTheDocument();
	expect(screen.getByText("604-555-0100")).toBeInTheDocument();
	expect(screen.getByText("My pay stub is missing.")).toBeInTheDocument();
});

test("C-TD-02 an unassigned ticket says so", () => {
	show({ ...supportTicket, assignee: undefined });
	expect(screen.getByText("Unassigned")).toBeInTheDocument();
});

test("C-TD-03 the attachment downloads through the signed-in API (was a plain link without the token)", async () => {
	window.URL.createObjectURL = jest.fn(() => "blob:x");
	window.URL.revokeObjectURL = jest.fn();
	API.get.mockResolvedValue({ data: new Blob(["pdf"]) });
	show(supportTicket);
	fireEvent.click(screen.getByLabelText("Download file"));
	await waitFor(() =>
		expect(API.get).toHaveBeenCalledWith("/ticket/download/stub.pdf", { responseType: "blob" }),
	);
});

test("C-TD-04 a website lead ticket shows the linked CRM Lead's details", () => {
	show({
		_id: "t2",
		ticketNumber: "261118ABC#00007",
		category: SUPPORT_CATEGORY,
		status: TICKET_ACTION.OPEN,
		topic: "New Lead: Sales enquiry from ABC Store",
		issue: "Need payroll for 25 staff.",
		leadId: {
			_id: "l1",
			name: "Ana Lee",
			opportunityName: "ABC Store",
			email: "ana@example.test",
			totalEmployees: "25",
			marketingComms: false,
			ticketType: "Sales enquiry",
			stage: "L1",
		},
	});
	expect(screen.getByText("Lead details")).toBeInTheDocument();
	expect(screen.getAllByText("Ana Lee").length).toBe(2); // originator + lead name
	expect(screen.getByText("ABC Store")).toBeInTheDocument();
	expect(screen.getByText("25")).toBeInTheDocument();
	expect(screen.getByText("No")).toBeInTheDocument(); // marketing e-mails
	expect(screen.getByText("Sales enquiry")).toBeInTheDocument();
});

test("C-TD-05 a ticket without a linked lead has no Lead details section", () => {
	show({ _id: "t3", ticketNumber: "T3", leadId: "65c000000000000000000001" }); // not loaded
	expect(screen.queryByText("Lead details")).toBeNull();
});
