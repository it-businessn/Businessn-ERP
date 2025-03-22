import { Select } from "@chakra-ui/react";
import useCompany from "hooks/useCompany";
import useEmployeePayReport from "hooks/useEmployeePayReport";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import { CURRENT_YEAR } from "utils/convertDate";
import PreviewReportsModal from "../process-payroll/preview-reports/PreviewReportsModal";
import TotalsReportModal from "../process-payroll/preview-reports/TotalsReportModal";
import WorkviewTable from "../workview/paygroup-header-table/WorkviewTable";

const ReportListView = () => {
	const { year } = useParams();
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const [yearsList, setYearsList] = useState([CURRENT_YEAR]);
	const [selectedYear, setSelectedYear] = useState(year ?? CURRENT_YEAR);

	const { payGroupSchedule, closestRecordIndex, selectedPayGroup } = usePaygroup(
		company,
		false,
		selectedYear,
		true,
	);

	useEffect(() => {
		if (selectedPayGroup) setYearsList(selectedPayGroup?.yearSchedules.map(({ year }) => year));
	}, [selectedPayGroup]);

	let filteredPayPeriods = closestRecordIndex
		? payGroupSchedule?.filter((_, index) => index <= closestRecordIndex || _?.isProcessed)
		: payGroupSchedule;

	filteredPayPeriods = filteredPayPeriods?.sort(
		(a, b) => new Date(b.payPeriodPayDate) - new Date(a.payPeriodPayDate),
	);
	const [showReport, setShowReport] = useState(undefined);
	const [showTotalsReport, setShowTotalsReport] = useState(false);
	const [totalsReport, setTotalsReport] = useState(null);
	const [selectedPayPeriod, setSelectedPayPeriod] = useState(null);

	useEffect(() => {
		const fetchFundTotalsInfo = async () => {
			try {
				const payNum = selectedPayPeriod?.payPeriod || selectedPayPeriod;
				const extraRun = selectedPayPeriod?.isExtraRun || false;
				const { data } = await PayrollService.getTotalsPayReportDetails(company, payNum, extraRun);

				setTotalsReport(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (selectedPayPeriod && showTotalsReport) fetchFundTotalsInfo();
	}, [selectedPayPeriod]);

	const handleTotalsReport = (payNo, isExtra) => {
		const payNum = getPayNum(payNo, isExtra);
		setSelectedPayPeriod(payNum);
		setShowTotalsReport(true);
	};

	const getPayNum = (payNo, isExtra) =>
		isExtra
			? payGroupSchedule?.find(
					({ payPeriod, isExtraRun }) => payPeriod === parseInt(payNo) && isExtraRun === isExtra,
			  )
			: payNo;

	const handleRegister = (payNo, isExtra) => {
		const payNum = getPayNum(payNo, isExtra);
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
				{yearsList?.map((year) => (
					<option value={year} key={year}>
						{year}
					</option>
				))}
			</Select>
			{filteredPayPeriods && (
				<WorkviewTable
					payGroupSchedule={filteredPayPeriods}
					closestRecordIndex={closestRecordIndex}
					height="calc(100vh - 192px)"
					handleRegister={handleRegister}
					selectedYear={selectedYear}
					handleTotalsReport={handleTotalsReport}
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
			{showTotalsReport && totalsReport && (
				<TotalsReportModal
					isOpen={showTotalsReport}
					onClose={() => setShowTotalsReport(false)}
					reportData={totalsReport}
				/>
			)}
		</PageLayout>
	);
};

export default ReportListView;
