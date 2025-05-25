import PreviewReportsModal from "../../process-payroll/preview-reports/PreviewReportsModal";
import TotalsReportModal from "../../process-payroll/preview-reports/TotalsReportModal";
import JournalsReportModal from "../../process-payroll/preview-reports/JournalsReportModal";

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
          company={company}
          isOpen={showTotalsReport}
          onClose={onClose}
          reportData={totalsReport}
        />
      )}
      {showJournalsReport && journalReport && (
        <JournalsReportModal
          isOpen={showJournalsReport}
          onClose={onClose}
          reportData={journalReport}
        />
      )}
    </>
  );
};
