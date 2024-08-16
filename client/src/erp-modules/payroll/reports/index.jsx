import useEmployeePayReport from "hooks/useEmployeePayReport";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PreviewReportsModal from "../process-payroll/preview-reports/PreviewReportsModal";
import WorkviewTable from "../workview/paygroup-header-table/WorkviewTable";

const Reports = () => {
	const company = LocalStorageService.getItem("selectedCompany");

	const { payGroupSchedule, closestRecordIndex } = usePaygroup(company, false);
	const filteredPayPeriods = payGroupSchedule?.filter(
		(_, index) => index < closestRecordIndex,
	);

	const [showReport, setShowReport] = useState(undefined);
	const [selectedPayPeriod, setSelectedPayPeriod] = useState(undefined);

	const handleRegister = (payPeriod) => {
		setSelectedPayPeriod(payPeriod);
		setShowReport(true);
	};

	const inputsReviewData = useEmployeePayReport(
		company,
		selectedPayPeriod,
		showReport,
	);

	return (
		<PageLayout title={"Reports"}>
			{filteredPayPeriods && (
				<WorkviewTable
					payGroupSchedule={filteredPayPeriods}
					closestRecordIndex={closestRecordIndex}
					height="82vh"
					handleRegister={handleRegister}
				/>
			)}
			{showReport && (
				<PreviewReportsModal
					isOpen={showReport}
					onClose={() => setShowReport(false)}
					reportData={inputsReviewData}
					payPeriodNum={selectedPayPeriod}
				/>
			)}
		</PageLayout>
	);
};

export default Reports;
