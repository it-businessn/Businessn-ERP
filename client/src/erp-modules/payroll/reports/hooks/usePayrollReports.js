import { useState, useEffect } from "react";
import PayrollService from "services/PayrollService";

export const usePayrollReports = (company, selectedYear) => {
  const [showReport, setShowReport] = useState(false);
  const [showTotalsReport, setShowTotalsReport] = useState(false);
  const [showJournalsReport, setShowJournalsReport] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [totalsReport, setTotalsReport] = useState(null);
  const [journalReport, setJournalReport] = useState(null);
  const [reportData, setReport] = useState(null);
  const [selectedPayPeriod, setSelectedPayPeriod] = useState(null);

  const getPayNum = (payNo, isExtra, payGroupSchedule) =>
    isExtra
      ? payGroupSchedule?.find(
          ({ payPeriod, isExtraRun }) => payPeriod === parseInt(payNo) && isExtraRun === isExtra
        )
      : payNo;

  useEffect(() => {
    const payNum = selectedPayPeriod?.payPeriod ?? selectedPayPeriod;
    const extraRun = selectedPayPeriod?.isExtraRun ?? false;

    setHasLoaded(false);

    const fetchReportData = async () => {
      try {
        if (showTotalsReport) {
          setTotalsReport(null);
          const { data } = await PayrollService.getTotalsPayReportDetails(
            company,
            payNum,
            extraRun
          );
          setTotalsReport(data);
        } else if (showReport) {
          setReport(null);
          const { data } = await PayrollService.getPayReportDetails(
            company,
            payNum,
            extraRun,
            selectedYear
          );
          setReport(data);
        } else if (showJournalsReport) {
          setJournalReport(null);
          const { data } = await PayrollService.getJournalEntryReportDetails(
            company,
            payNum,
            extraRun
          );
          setJournalReport(data);
        }
        setHasLoaded(true);
      } catch (error) {
        console.error(error);
        setHasLoaded(true);
      }
    };

    if (selectedPayPeriod && (showTotalsReport || showReport || showJournalsReport)) {
      fetchReportData();
    }
  }, [selectedPayPeriod, showReport, showTotalsReport, showJournalsReport, company, selectedYear]);

  const handleRegister = (payNo, isExtra, payGroupSchedule) => {
    const payNum = getPayNum(payNo, isExtra, payGroupSchedule);
    setSelectedPayPeriod(payNum);
    setShowReport(true);
    setShowTotalsReport(false);
    setShowJournalsReport(false);
  };

  const handleTotalsReport = (payNo, isExtra, payGroupSchedule) => {
    const payNum = getPayNum(payNo, isExtra, payGroupSchedule);
    setSelectedPayPeriod(payNum);
    setShowTotalsReport(true);
    setShowReport(false);
    setShowJournalsReport(false);
  };

  const handleJournalsReport = (payNo, isExtra, payGroupSchedule) => {
    const payNum = getPayNum(payNo, isExtra, payGroupSchedule);
    setSelectedPayPeriod(payNum);
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
