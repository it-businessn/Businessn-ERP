import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeePayInfo = (company, refresh, empId, payPeriod, groupId, isOnboarding) => {
	const [payInfo, setPayInfo] = useState(null);

	useEffect(() => {
		const fetchEmployeePayInfo = async () => {
			try {
				const { data } = empId
					? await PayrollService.getEmployeePayInfo(company, empId)
					: payPeriod &&
					  (await PayrollService.getAllEmployeePayInfo(
							company,
							payPeriod.payPeriodPayDate,
							payPeriod.isExtraRun,
							groupId,
					  ));
				setPayInfo(data);
			} catch (error) {
				console.error(error);
			}
		};
		// if (!isOnboarding) {
		fetchEmployeePayInfo();
		// }
	}, [company, empId, refresh, payPeriod, isOnboarding]);
	return payInfo;
};

export default useEmployeePayInfo;
