import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeePayReport = (company, payPeriodNum, isOpen, year = "2025") => {
	const [report, setReport] = useState(null);

	useEffect(() => {
		const payNum = payPeriodNum?.payPeriod ?? payPeriodNum;
		const extraRun = payPeriodNum?.isExtraRun ?? false;

		const fetchHoursWorkedInfo = async () => {
			try {
				const { data } = await PayrollService.getPayReportDetails(company, payNum, extraRun, year);
				setReport(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (payPeriodNum && isOpen) {
			fetchHoursWorkedInfo();
		}
	}, [company, payPeriodNum, isOpen, year]);
	return report;
};

export default useEmployeePayReport;
