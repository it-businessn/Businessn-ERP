import { HStack, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import OutlineButton from "components/ui/button/OutlineButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import useFundingTotalsReport from "hooks/useFundingTotalsReport";
import useJournalReport from "hooks/useJournalReport";
import { useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import { useBreakpointValue } from "services/Breakpoint";
import LocalStorageService from "services/LocalStorageService";
import JournalsReportModal from "../reports/JournalsReportModal";
import PreviewReportsModal from "../reports/PreviewReportsModal";
import TotalsReportModal from "../reports/TotalsReportModal";

const ReportsPreview = ({
	company,
	handleClick,
	reportData,
	closestRecord,
	isPayPeriodInactive,
}) => {
	const companyDetails = LocalStorageService.getItem("user")?.companyId;
	const { isMobile } = useBreakpointValue();
	const [showReport, setShowReport] = useState(false);
	const [showTotalsReport, setShowTotalsReport] = useState(false);
	const [showJournalReport, setShowJournalReport] = useState(false);

	const REPORTS = [
		{ name: "Payroll Register", handleClick: () => setShowReport(true) },
		{ name: "Funding Totals Report", handleClick: () => setShowTotalsReport(true) },
		{ name: "Journal Entry Report", handleClick: () => setShowJournalReport(true) },
	];

	const fundingTotalsData = useFundingTotalsReport(company, closestRecord, showTotalsReport);
	const journalReport = useJournalReport(company, closestRecord, showJournalReport);

	return (
		<HStack alignItems={"end"}>
			<Table w={"100%"}>
				<Tbody>
					{REPORTS?.map(({ name, handleClick }) => (
						<Tr key={name}>
							<Td>
								<TextTitle title={name} textTransform="uppercase" />
							</Td>

							<Td>
								<OutlineButton label="Preview report" size={"sm"} onClick={handleClick} />
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
			{showReport && reportData && (
				<PreviewReportsModal
					companyDetails={companyDetails}
					isMobile={isMobile}
					isOpen={showReport}
					onClose={() => setShowReport(false)}
					reportData={reportData}
				/>
			)}
			{showTotalsReport && fundingTotalsData && (
				<TotalsReportModal
					companyDetails={companyDetails}
					isOpen={showTotalsReport}
					onClose={() => setShowTotalsReport(false)}
					reportData={fundingTotalsData}
				/>
			)}
			{showJournalReport && journalReport && (
				<JournalsReportModal
					companyDetails={companyDetails}
					isOpen={showJournalReport}
					onClose={() => setShowJournalReport(false)}
					reportData={journalReport}
				/>
			)}
			<PrimaryButton
				bg="var(--action_status_approve)"
				name={"CONFIRM"}
				rightIcon={<MdCheckCircle />}
				isDisabled={showReport === undefined || isPayPeriodInactive}
				loadingText="Loading"
				onOpen={handleClick}
			/>
		</HStack>
	);
};

export default ReportsPreview;
