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
