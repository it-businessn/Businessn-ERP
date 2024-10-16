import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeEEContribution = (company, payPeriod, groupId) => {
	const [hours, setHours] = useState(null);

	useEffect(() => {
		const extraRun = payPeriod?.isExtraRun ?? false;
		const fetchEEContribution = async () => {
			try {
				const response = await PayrollService.getEEContribution(
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
			fetchEEContribution();
		}
	}, [company, payPeriod]);
	return hours;
};

export default useEmployeeEEContribution;
