import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeePayReport = (company, payPeriodNum, isOpen, year = "2025") => {
	const [report, setReport] = useState(null);

	useEffect(() => {
		const extraRun = payPeriodNum?.isExtraRun || false;
		const frequency =
			payPeriodNum?.frequency === "bi-weekly" ? "Biweekly" : payPeriodNum?.frequency;

		const fetchHoursWorkedInfo = async () => {
			try {
				const { data } = await PayrollService.getRegisterDetails(
					company,
					payPeriodNum?.payPeriod,
					extraRun,
					payPeriodNum?.payPeriodPayDate,
					frequency,
					year,
				);
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
