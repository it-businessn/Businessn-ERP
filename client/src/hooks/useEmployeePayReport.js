import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeePayReport = (company, payPeriod) => {
	const [hours, setHours] = useState(null);

	useEffect(() => {
		const fetchHoursWorkedInfo = async () => {
			try {
				const response = await PayrollService.getPayReportDetails(
					company,
					payPeriod.payPeriodStartDate,
					payPeriod.payPeriodEndDate,
				);
				setHours(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		if (payPeriod) {
			fetchHoursWorkedInfo();
		}
	}, [company, payPeriod]);
	return hours;
};

export default useEmployeePayReport;
