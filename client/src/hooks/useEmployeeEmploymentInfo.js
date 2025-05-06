import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeEmploymentInfo = (company, empId, payPeriod, groupId, refresh, deptName) => {
	const [employmentInfo, setEmploymentInfo] = useState(null);

	useEffect(() => {
		const extraRun = payPeriod?.isExtraRun ?? false;
		const fetchEmployeeEmploymentInfo = async () => {
			try {
				const { data } = empId
					? await PayrollService.getEmployeeEmploymentInfo(company, empId)
					: await PayrollService.getAllEmployeeEmploymentInfo(
							company,
							payPeriod?.payPeriodStartDate,
							payPeriod?.payPeriodEndDate,
							payPeriod?.payPeriodPayDate,
							extraRun,
							groupId,
							deptName,
					  );
				setEmploymentInfo(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchEmployeeEmploymentInfo();
	}, [company, empId, payPeriod, refresh]);
	return employmentInfo;
};

export default useEmployeeEmploymentInfo;
