import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeePayInfo = (company, refresh, empId, payPeriod) => {
	const [payInfo, setPayInfo] = useState(null);

	useEffect(() => {
		const fetchEmployeePayInfo = async () => {
			try {
				const response = empId
					? await PayrollService.getEmployeePayInfo(company, empId)
					: await PayrollService.getAllEmployeePayInfo(
							company,
							payPeriod.payPeriodStartDate,
							payPeriod.payPeriodEndDate,
					  );
				setPayInfo(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchEmployeePayInfo();
	}, [company, empId, refresh]);
	return payInfo;
};

export default useEmployeePayInfo;
