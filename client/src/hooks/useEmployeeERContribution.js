import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeERContribution = (company, payPeriod, groupId) => {
	const [hours, setHours] = useState(null);

	useEffect(() => {
		const extraRun = payPeriod?.isExtraRun ?? false;
		const fetchERContribution = async () => {
			try {
				const response = await PayrollService.getERContribution(
					company,
					payPeriod.payPeriodStartDate,
					payPeriod.payPeriodEndDate,
					payPeriod?.payPeriodPayDate,
					extraRun,
					groupId,
				);
				setHours(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		if (payPeriod) {
			fetchERContribution();
		}
	}, [company, payPeriod]);
	return hours;
};

export default useEmployeeERContribution;
