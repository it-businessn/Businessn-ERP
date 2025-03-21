import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeERContribution = (company, payPeriod, groupId, payrunOption, deptName) => {
	const [hours, setHours] = useState(null);

	useEffect(() => {
		const extraRun = payPeriod?.isExtraRun ?? false;
		const fetchERContribution = async () => {
			try {
				const { data } = await PayrollService.getERContribution(
					company,
					payPeriod.payPeriodStartDate,
					payPeriod.payPeriodEndDate,
					payPeriod?.payPeriodPayDate,
					extraRun,
					groupId,
					payrunOption,
					deptName,
				);
				setHours(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (payPeriod) {
			fetchERContribution();
		}
	}, [company, payPeriod, payrunOption]);
	return hours;
};

export default useEmployeeERContribution;
