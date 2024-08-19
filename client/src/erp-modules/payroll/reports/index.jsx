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
		(_, index) => index <= closestRecordIndex,
	);

	const [showReport, setShowReport] = useState(undefined);
	const [selectedPayPeriod, setSelectedPayPeriod] = useState(undefined);

	const handleRegister = (payNo, isExtra) => {
		const payNum = isExtra
			? payGroupSchedule?.find(
					({ payPeriod, isExtraRun }) =>
						payPeriod === parseInt(payNo) && isExtraRun === isExtra,
			  )
			: payNo;

		setSelectedPayPeriod(payNum);
		setShowReport(true);
	};

	const registerData = useEmployeePayReport(
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
					height="80vh"
					handleRegister={handleRegister}
				/>
			)}
			{showReport && (
				<PreviewReportsModal
					isOpen={showReport}
					onClose={() => setShowReport(false)}
					reportData={registerData}
					payPeriodNum={selectedPayPeriod}
				/>
			)}
		</PageLayout>
	);
};

export default Reports;
