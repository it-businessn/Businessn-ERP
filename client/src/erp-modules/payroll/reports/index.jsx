import useCompany from "hooks/useCompany";
import useEmployeePayReport from "hooks/useEmployeePayReport";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PreviewReportsModal from "../process-payroll/preview-reports/PreviewReportsModal";
import WorkviewTable from "../workview/paygroup-header-table/WorkviewTable";

const Reports = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));

	const { payGroupSchedule, closestRecordIndex } = usePaygroup(company, false);

	const filteredPayPeriods = payGroupSchedule
		?.filter((_, index) => index <= closestRecordIndex)
		.sort((a, b) => new Date(b.payPeriodPayDate) - new Date(a.payPeriodPayDate));

	const [showReport, setShowReport] = useState(undefined);
	const [selectedPayPeriod, setSelectedPayPeriod] = useState(null);

	const handleRegister = (payNo, isExtra) => {
		const payNum = isExtra
			? payGroupSchedule?.find(
					({ payPeriod, isExtraRun }) => payPeriod === parseInt(payNo) && isExtraRun === isExtra,
			  )
			: payNo;

		setSelectedPayPeriod(payNum);
		setShowReport(true);
	};

	const reportData = useEmployeePayReport(company, selectedPayPeriod, showReport);

	return (
		<PageLayout title={"Reports"}>
			{filteredPayPeriods && (
				<WorkviewTable
					payGroupSchedule={filteredPayPeriods}
					closestRecordIndex={closestRecordIndex}
					height="80vh"
					handleRegister={handleRegister}
				/>
			)}
			{showReport && (
				<PreviewReportsModal
					isReport
					isOpen={showReport}
					onClose={() => setShowReport(false)}
					reportData={reportData}
					payPeriodNum={selectedPayPeriod}
				/>
			)}
		</PageLayout>
	);
};

export default Reports;
