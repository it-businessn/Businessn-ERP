import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import CommunicationService from "services/CommsService";
import Announcements from "./Announcements";

jest.mock("services/CommsService", () => ({
	__esModule: true,
	default: { getAnnouncement: jest.fn() },
}));

test("C-SUP-01 each Support notice shows its own text, for any company", async () => {
	CommunicationService.getAnnouncement.mockResolvedValue({
		data: [
			{
				_id: "n1",
				title: "Minimum Wage Increase Effective June 1, 2026",
				message: "The B.C. general minimum wage increased from $17.85 to $18.25 per hour.\n•	Do Not Pro-rate: only June hours.",
				createdOn: "2026-05-15T16:00:00.000Z",
			},
			{
				_id: "n2",
				title: "Can Statutory Holidays Be Moved to Another Day?",
				message: "Yes! Employers and employees may agree in writing.",
				createdOn: "2025-07-15T16:00:00.000Z",
			},
		],
	});
	render(
		<ChakraProvider>
			<Announcements company="Cornerstone Maintenance Group Ltd." />
		</ChakraProvider>,
	);
	expect(await screen.findByText("Minimum Wage Increase Effective June 1, 2026")).toBeInTheDocument();
	expect(CommunicationService.getAnnouncement).toHaveBeenCalledWith("Cornerstone Maintenance Group Ltd.");
	expect(screen.getByText(/increased from \$17\.85 to \$18\.25/)).toBeInTheDocument();
	expect(screen.getByText(/Do Not Pro-rate/)).toBeInTheDocument();
	expect(screen.getByText("Yes! Employers and employees may agree in writing.")).toBeInTheDocument();
	// the old hard-coded 2025 text is gone
	expect(screen.queryByText(/\$17\.40 to \$17\.85/)).not.toBeInTheDocument();
	expect(screen.getAllByText("Support Assistant")).toHaveLength(2);
});
