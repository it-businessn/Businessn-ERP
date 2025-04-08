import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useJournalReport = (company, payPeriodNum, isOpen) => {
	const [report, setReport] = useState(null);

	useEffect(() => {
		const payNum = payPeriodNum?.payPeriod ?? payPeriodNum;
		const extraRun = payPeriodNum?.isExtraRun ?? false;

		const fetchJournalEntries = async () => {
			try {
				const { data } = await PayrollService.getJournalEntryReportDetails(
					company,
					payNum,
					extraRun,
				);
				setReport(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (payPeriodNum && isOpen) {
			fetchJournalEntries();
		}
	}, [company, payPeriodNum, isOpen]);
	return report;
};

export default useJournalReport;
