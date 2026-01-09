import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useFundingTotalsReport = (company, closestRecord, isOpen) => {
	const [report, setReport] = useState(null);

	const scheduleFrequency =
		closestRecord?.frequency === "bi-weekly" ? "Biweekly" : closestRecord?.frequency;

	useEffect(() => {
		const payNum = closestRecord?.payPeriod;
		const extraRun = closestRecord?.isExtraRun || false;

		const fetchTotalsReportInfo = async () => {
			try {
				const { data } = await PayrollService.getTotalFundingPayReportDetails(
					company,
					payNum,
					closestRecord?.payPeriodPayDate,
					extraRun,
					scheduleFrequency,
				);
				setReport(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (closestRecord && isOpen) {
			fetchTotalsReportInfo();
		}
	}, [company, closestRecord, isOpen]);
	return report;
};

export default useFundingTotalsReport;
