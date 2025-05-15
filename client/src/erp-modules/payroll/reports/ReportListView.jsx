import { Flex, Select } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import useCompany from "hooks/useCompany";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useBreakpointValue } from "services/Breakpoint";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import { CURRENT_YEAR } from "utils/convertDate";
import JournalsReportModal from "../process-payroll/preview-reports/JournalsReportModal";
import PreviewReportsModal from "../process-payroll/preview-reports/PreviewReportsModal";
import TotalsReportModal from "../process-payroll/preview-reports/TotalsReportModal";
import WorkviewTable from "../workview/paygroup-header-table/WorkviewTable";

const ReportListView = () => {
	const { year } = useParams();
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const [yearsList, setYearsList] = useState([CURRENT_YEAR]);
	const [selectedYear, setSelectedYear] = useState(year ?? CURRENT_YEAR);
	const { isMobile } = useBreakpointValue();
	const { payGroupSchedule, closestRecordIndex, selectedPayGroup } = usePaygroup(
		company,
		false,
		selectedYear,
		true,
	);

	const selectedPayPeriodDetails = useRef(null);
	const [showReport, setShowReport] = useState(undefined);
	const [showTotalsReport, setShowTotalsReport] = useState(false);
	const [showJournalsReport, setShowJournalsReport] = useState(false);
	const [hasLoaded, setHasLoaded] = useState(false);
	const [totalsReport, setTotalsReport] = useState(null);
	const [journalReport, setJournalReport] = useState(null);
	const [reportData, setReport] = useState(null);

	useEffect(() => {
		if (selectedPayGroup) setYearsList(selectedPayGroup?.yearSchedules?.map(({ year }) => year));
	}, [selectedPayGroup]);

	useEffect(() => {
		if (!selectedPayPeriodDetails?.current) {
			return;
		}
		setHasLoaded(false);
		const { isExtra, payNum, payPeriodPayDate } = selectedPayPeriodDetails?.current;
		const extraRun = isExtra || false;

		const scheduleFrequency =
			selectedPayGroup?.scheduleFrequency === "bi-weekly"
				? "Biweekly"
				: selectedPayGroup?.scheduleFrequency;

		const fetchJournalInfo = async () => {
			try {
				setJournalReport(null);
				const { data } = await PayrollService.getJournalEntryReportDetails(
					company,
					payNum,
					extraRun,
				);
				setHasLoaded(true);
				setJournalReport(data);
			} catch (error) {
				console.error(error);
			}
		};

		const fetchFundTotalsInfo = async () => {
			try {
				setTotalsReport(null);
				const { data } = await PayrollService.getTotalsPayReportDetails(company, payNum, extraRun);
				setHasLoaded(true);
				setTotalsReport(data);
			} catch (error) {
				console.error(error);
			}
		};

		const fetchHoursWorkedInfo = async () => {
			try {
				setReport(null);
				const { data } = await PayrollService.getPayReportDetails(
					company,
					payNum,
					extraRun,
					payPeriodPayDate,
					scheduleFrequency,
					selectedYear,
				);
				setReport(data);
				setHasLoaded(true);
			} catch (error) {
				console.error(error);
			}
		};

		if (payNum && showTotalsReport) {
			fetchFundTotalsInfo();
		} else if (payNum && showReport) {
			fetchHoursWorkedInfo();
		} else if (payNum && showJournalsReport) {
			fetchJournalInfo();
		}
	}, [selectedPayPeriodDetails?.current, showReport, year, showTotalsReport, showJournalsReport]);

	const getPayNum = (payNo, isExtra) =>
		isExtra
			? payGroupSchedule?.find(
					({ payPeriod, isExtraRun }) => payPeriod === parseInt(payNo) && isExtraRun === isExtra,
			  )
			: payNo;

	const handleRegister = (payNo, isExtra, payPeriodPayDate) => {
		const payNum = getPayNum(payNo, isExtra);
		selectedPayPeriodDetails.current = { payNum, isExtra, payPeriodPayDate };
		setShowReport(true);
		setShowTotalsReport(false);
		setShowJournalsReport(false);
	};

	const handleTotalsReport = (payNo, isExtra, payPeriodPayDate) => {
		const payNum = getPayNum(payNo, isExtra);
		selectedPayPeriodDetails.current = { payNum, isExtra, payPeriodPayDate };
		setShowTotalsReport(true);
		setShowReport(false);
		setShowJournalsReport(false);
	};

	const handleJournalsReport = (payNo, isExtra, payPeriodPayDate) => {
		const payNum = getPayNum(payNo, isExtra);
		selectedPayPeriodDetails.current = { payNum, isExtra, payPeriodPayDate };
		setShowTotalsReport(false);
		setShowReport(false);
		setShowJournalsReport(true);
	};

	let filteredPayPeriods = closestRecordIndex
		? payGroupSchedule?.filter((_, index) => index <= closestRecordIndex || _?.isProcessed)
		: payGroupSchedule;

	filteredPayPeriods = filteredPayPeriods?.sort(
		(a, b) => new Date(b.payPeriodPayDate) - new Date(a.payPeriodPayDate),
	);

	return (
		<PageLayout title="Payrun Reports">
			<Flex gap={3}>
				<TextTitle
					weight="normal"
					p={1}
					width="200px"
					size="sm"
					borderRadius="10px"
					border="1px solid var(--primary_button_bg)"
					title={selectedPayGroup?.name}
				/>
				<Select
					w={"10%"}
					size={"sm"}
					border="1px solid var(--primary_button_bg)"
					borderRadius="10px"
					value={selectedYear}
					onChange={(e) => setSelectedYear(e.target.value)}
				>
					{yearsList?.map((year) => (
						<option value={year} key={year}>
							{year}
						</option>
					))}
				</Select>
			</Flex>

			{filteredPayPeriods && (
				<WorkviewTable
					payGroupSchedule={filteredPayPeriods}
					closestRecordIndex={closestRecordIndex}
					height="calc(100vh - 192px)"
					handleRegister={handleRegister}
					selectedYear={selectedYear}
					handleTotalsReport={handleTotalsReport}
					handleJournalsReport={handleJournalsReport}
				/>
			)}
			{hasLoaded && showReport && reportData && (
				<PreviewReportsModal
					isMobile={isMobile}
					isReport
					isOpen={showReport}
					onClose={() => setShowReport(false)}
					reportData={reportData}
				/>
			)}
			{hasLoaded && showTotalsReport && totalsReport && (
				<TotalsReportModal
					company={company}
					isOpen={showTotalsReport}
					onClose={() => setShowTotalsReport(false)}
					reportData={totalsReport}
				/>
			)}
			{hasLoaded && showJournalsReport && journalReport && (
				<JournalsReportModal
					isOpen={showJournalsReport}
					onClose={() => setShowJournalsReport(false)}
					reportData={journalReport}
				/>
			)}
		</PageLayout>
	);
};

export default ReportListView;
