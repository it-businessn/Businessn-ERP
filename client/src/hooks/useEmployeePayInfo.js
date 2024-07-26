import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeePayInfo = (company, refresh, empId) => {
	const [payInfo, setPayInfo] = useState(null);

	useEffect(() => {
		const fetchEmployeePayInfo = async () => {
			try {
				const response = empId
					? await PayrollService.getEmployeePayInfo(company, empId)
					: await PayrollService.getAllEmployeePayInfo(company);
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
