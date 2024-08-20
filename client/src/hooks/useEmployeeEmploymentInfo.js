import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeEmploymentInfo = (
	company,
	empId,
	payPeriod,
	groupId,
	refresh,
) => {
	const [employmentInfo, setEmploymentInfo] = useState(null);

	useEffect(() => {
		const extraRun = payPeriod?.isExtraRun ?? false;
		const fetchEmployeeEmploymentInfo = async () => {
			try {
				const response = empId
					? await PayrollService.getEmployeeEmploymentInfo(company, empId)
					: await PayrollService.getAllEmployeeEmploymentInfo(
							company,
							payPeriod?.payPeriodStartDate,
							payPeriod?.payPeriodEndDate,
							payPeriod?.payPeriodPayDate,
							extraRun,
							groupId,
					  );
				setEmploymentInfo(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		if (payPeriod) {
			fetchEmployeeEmploymentInfo();
		}
	}, [company, empId, payPeriod, refresh]);
	return employmentInfo;
};

export default useEmployeeEmploymentInfo;
