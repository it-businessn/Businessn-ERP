import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeHoursWorked = (company, payPeriod) => {
	const [hours, setHours] = useState(null);

	useEffect(() => {
		const fetchHoursWorkedInfo = async () => {
			try {
				const response = await PayrollService.getHoursWorkedAllocation(
					company,
					payPeriod.payPeriodStartDate,
					payPeriod.payPeriodEndDate,
				);
				setHours(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchHoursWorkedInfo();
	}, [company]);
	return hours;
};

export default useEmployeeHoursWorked;
