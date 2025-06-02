import { useEffect, useRef, useState } from "react";
import PayrollService from "services/PayrollService";

export const usePayrollReports = (company, selectedYear, payGroupSchedule, selectedPayGroup) => {
	const selectedPayPeriodDetails = useRef(null);
	const [showReport, setShowReport] = useState(false);
	const [showTotalsReport, setShowTotalsReport] = useState(false);
	const [showJournalsReport, setShowJournalsReport] = useState(false);
	const [hasLoaded, setHasLoaded] = useState(false);
	const [totalsReport, setTotalsReport] = useState(null);
	const [journalReport, setJournalReport] = useState(null);
	const [reportData, setReport] = useState(null);

	const getPayNum = (payNo, isExtra) =>
		isExtra
			? payGroupSchedule?.find(
					({ payPeriod, isExtraRun }) => payPeriod === parseInt(payNo) && isExtraRun === isExtra,
			  )
			: payNo;

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

		const fetchFundTotalsInfo = async () => {
			try {
				setTotalsReport(null);
				const { data } = await PayrollService.getTotalsPayReportDetails(
					company,
					payNum,
					extraRun,
					scheduleFrequency,
				);
				setHasLoaded(true);
				setTotalsReport(data);
			} catch (error) {
				console.error(error);
			}
		};

		const fetchReportData = async () => {
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

		const fetchJournalInfo = async () => {
			try {
				setJournalReport(null);
				const { data } = await PayrollService.getJournalEntryReportDetails(
					company,
					payNum,
					extraRun,
					scheduleFrequency,
				);
				setHasLoaded(true);
				setJournalReport(data);
			} catch (error) {
				console.error(error);
			}
		};

		if (payNum && showTotalsReport) {
			fetchFundTotalsInfo();
		} else if (payNum && showReport) {
			fetchReportData();
		} else if (payNum && showJournalsReport) {
			fetchJournalInfo();
		}
	}, [
		selectedPayPeriodDetails?.current,
		showReport,
		showTotalsReport,
		showJournalsReport,
		selectedYear,
	]);

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

	const closeReports = () => {
		setShowReport(false);
		setShowTotalsReport(false);
		setShowJournalsReport(false);
	};

	return {
		showReport,
		showTotalsReport,
		showJournalsReport,
		hasLoaded,
		totalsReport,
		journalReport,
		reportData,
		handleRegister,
		handleTotalsReport,
		handleJournalsReport,
		closeReports,
	};
};
