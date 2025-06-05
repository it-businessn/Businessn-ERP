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
}) => {
	if (!hasLoaded) return null;

	return (
		<>
			{showReport && reportData && (
				<PreviewReportsModal
					isMobile={isMobile}
					isReport
					isOpen={showReport}
					onClose={onClose}
					reportData={reportData}
				/>
			)}
			{showTotalsReport && totalsReport && (
				<TotalsReportModal
					isReport
					company={company}
					isOpen={showTotalsReport}
					onClose={onClose}
					reportData={totalsReport}
				/>
			)}
			{showJournalsReport && journalReport && (
				<JournalsReportModal
					isReport
					isOpen={showJournalsReport}
					onClose={onClose}
					reportData={journalReport}
				/>
			)}
		</>
	);
};
