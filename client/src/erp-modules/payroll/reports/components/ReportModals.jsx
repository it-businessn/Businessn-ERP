import { Box, Spinner } from "@chakra-ui/react";
import JournalsReportModal from "../JournalsReportModal";
import PreviewReportsModal from "../PreviewReportsModal";
import TotalsReportModal from "../TotalsReportModal";

export const ReportModals = ({
	hasLoaded,
	showReport,
	showTotalsReport,
	showJournalsReport,
	reportData,
	totalsReport,
	journalReport,
	company,
	isMobile,
	onClose,
	companyDetails,
}) => {
	const isFetching =
		(showReport && !reportData) ||
		(showTotalsReport && !totalsReport) ||
		(showJournalsReport && !journalReport);

	if (isFetching) {
		return (
			<Box
				position="fixed"
				inset={0}
				zIndex="modal"
				bg="blackAlpha.400"
				display="flex"
				alignItems="center"
				justifyContent="center"
			>
				<Spinner size="xl" thickness="4px" color="var(--banner_bg)" emptyColor="gray.200" />
			</Box>
		);
	}

	if (!hasLoaded) return null;

	return (
		<>
			{showReport && reportData && (
				<PreviewReportsModal
					companyDetails={companyDetails}
					isMobile={isMobile}
					isReport
					isOpen={showReport}
					onClose={onClose}
					reportData={reportData}
				/>
			)}
			{showTotalsReport && totalsReport && (
				<TotalsReportModal
					companyDetails={companyDetails}
					isReport
					company={company}
					isOpen={showTotalsReport}
					onClose={onClose}
					reportData={totalsReport}
				/>
			)}
			{showJournalsReport && journalReport && (
				<JournalsReportModal
					companyDetails={companyDetails}
					isReport
					isOpen={showJournalsReport}
					onClose={onClose}
					reportData={journalReport}
				/>
			)}
		</>
	);
};
