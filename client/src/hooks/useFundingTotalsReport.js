import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useFundingTotalsReport = (company, payPeriodNum, isOpen) => {
	const [report, setReport] = useState(null);

	useEffect(() => {
		const payNum = payPeriodNum?.payPeriod ?? payPeriodNum;
		const extraRun = payPeriodNum?.isExtraRun ?? false;

		const fetchTotalsReportInfo = async () => {
			try {
				const { data } = await PayrollService.getTotalFundingPayReportDetails(
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
			fetchTotalsReportInfo();
		}
	}, [company, payPeriodNum, isOpen]);
	return report;
};

export default useFundingTotalsReport;
