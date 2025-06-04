import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeEmploymentInfo = (
	company,
	empId,
	payPeriod,
	groupId,
	refresh,
	deptName,
	selectedPayGroupOption,
) => {
	const [employmentInfo, setEmploymentInfo] = useState(null);

	useEffect(() => {
		const extraRun = payPeriod?.isExtraRun ?? false;
		const fetchEmployeeEmploymentInfo = async () => {
			try {
				const { data } =
					// empId
					// ? await PayrollService.getEmployeeEmploymentInfo(company, empId)
					// :
					await PayrollService.getAllEmployeeEmploymentInfo({
						companyName: company,
						startDate: payPeriod?.payPeriodStartDate,
						endDate: payPeriod?.payPeriodEndDate,
						payDate: payPeriod?.payPeriodPayDate,
						isExtraRun: extraRun,
						groupId,
						deptName,
						selectedPayGroupOption,
					});
				setEmploymentInfo(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (company && payPeriod) {
			fetchEmployeeEmploymentInfo();
		}
	}, [company, refresh, selectedPayGroupOption]);
	return employmentInfo;
};

export default useEmployeeEmploymentInfo;
