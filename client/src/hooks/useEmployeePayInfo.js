import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeePayInfo = (company, refresh, empId, payPeriod, groupId) => {
	const [payInfo, setPayInfo] = useState(null);

	useEffect(() => {
		const fetchEmployeePayInfo = async () => {
			try {
				const response = empId
					? await PayrollService.getEmployeePayInfo(company, empId)
					: payPeriod &&
					  (await PayrollService.getAllEmployeePayInfo(
							company,
							payPeriod.payPeriodPayDate,
							payPeriod.isExtraRun,
							groupId,
					  ));
				setPayInfo(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchEmployeePayInfo();
	}, [company, empId, refresh, payPeriod]);
	return payInfo;
};

export default useEmployeePayInfo;
