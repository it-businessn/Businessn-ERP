import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeePayReport = (company, payPeriodNum, isOpen) => {
	const [hours, setHours] = useState(null);

	useEffect(() => {
		const payNum = payPeriodNum?.payPeriod ?? payPeriodNum;
		const extraRun = payPeriodNum?.isExtraRun ?? false;

		const fetchHoursWorkedInfo = async () => {
			try {
				const response = await PayrollService.getPayReportDetails(
					company,
					payNum,
					extraRun,
				);
				setHours(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		if (payPeriodNum && isOpen) {
			fetchHoursWorkedInfo();
		}
	}, [company, payPeriodNum, isOpen]);
	return hours;
};

export default useEmployeePayReport;
