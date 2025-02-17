import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeHoursWorked = (company, payPeriod, groupId, payrunOption) => {
	const [hours, setHours] = useState(null);

	useEffect(() => {
		const extraRun = payPeriod?.isExtraRun ?? false;
		const fetchHoursWorkedInfo = async () => {
			try {
				const { data } = await PayrollService.getHoursWorkedAllocationByType(
					company,
					payPeriod.payPeriodStartDate,
					payPeriod.payPeriodEndDate,
					payPeriod?.payPeriodPayDate,
					extraRun,
					groupId,
					payrunOption,
				);
				setHours(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (payPeriod) {
			fetchHoursWorkedInfo();
		}
	}, [company, payPeriod, payrunOption]);
	return hours;
};

export default useEmployeeHoursWorked;
