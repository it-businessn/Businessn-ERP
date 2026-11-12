import { HStack, Spinner, Table, Tbody, Td, Tr, useToast } from "@chakra-ui/react";
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
	const toast = useToast();

	const fundingTotalsData = useFundingTotalsReport(company, closestRecord, showTotalsReport);
	const journalReport = useJournalReport(company, closestRecord, showJournalReport);

	const REPORTS = [
		{
			name: "Payroll Register",
			handleClick: () => {
				if (!reportData) {
					toast({
						title: "Confirm Inputs Review first to load the register.",
						status: "info",
						duration: 3000,
						isClosable: true,
					});
				}
				setShowReport(true);
			},
		},
		{
			name: "Funding Totals Report",
			handleClick: () => setShowTotalsReport(true),
			isLoading: showTotalsReport && !fundingTotalsData,
		},
		{
			name: "Journal Entry Report",
			handleClick: () => setShowJournalReport(true),
			isLoading: showJournalReport && !journalReport,
		},
	];

	return (
		<HStack alignItems={"end"}>
			<Table w={"100%"}>
				<Tbody>
					{REPORTS?.map(({ name, handleClick, isLoading }) => (
						<Tr key={name}>
							<Td>
								<TextTitle title={name} textTransform="uppercase" />
							</Td>

							<Td>
								<OutlineButton
									label="Preview report"
									size={"sm"}
									onClick={handleClick}
									isDisabled={isLoading}
								/>
								{isLoading && <Spinner size="sm" ml={2} color="var(--banner_bg)" />}
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
