import { Select } from "@chakra-ui/react";
import useCompany from "hooks/useCompany";
import useEmployeePayReport from "hooks/useEmployeePayReport";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import { CURRENT_YEAR } from "utils/convertDate";
import PreviewReportsModal from "../process-payroll/preview-reports/PreviewReportsModal";
import WorkviewTable from "../workview/paygroup-header-table/WorkviewTable";

const ReportListView = () => {
	const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));

	const { payGroupSchedule, closestRecordIndex } = usePaygroup(company, false, selectedYear, true);

	let filteredPayPeriods = closestRecordIndex
		? payGroupSchedule?.filter((_, index) => index <= closestRecordIndex)
		: payGroupSchedule;

	filteredPayPeriods = filteredPayPeriods?.sort(
		(a, b) => new Date(b.payPeriodPayDate) - new Date(a.payPeriodPayDate),
	);
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
		<PageLayout title={"Payrun Reports"}>
			<Select
				w={"10%"}
				size={"sm"}
				border="1px solid var(--primary_button_bg)"
				borderRadius="10px"
				value={selectedYear}
				placeholder="Select Year"
				onChange={(e) => setSelectedYear(e.target.value)}
			>
				{[2024, 2025]?.map((year) => (
					<option value={year} key={year}>
						{year}
					</option>
				))}
			</Select>
			{filteredPayPeriods && (
				<WorkviewTable
					payGroupSchedule={filteredPayPeriods}
					closestRecordIndex={closestRecordIndex}
					height="80vh"
					handleRegister={handleRegister}
					selectedYear={selectedYear}
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

export default ReportListView;
