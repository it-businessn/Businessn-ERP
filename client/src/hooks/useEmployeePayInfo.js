import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeePayInfo = (company, empId) => {
	const [payInfo, setPayInfo] = useState(null);
	useEffect(() => {
		const fetchEmployeePayInfo = async () => {
			try {
				const response = await PayrollService.getEmployeePayInfo(
					company,
					empId,
				);
				setPayInfo(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchEmployeePayInfo();
	}, [company, empId]);
	return payInfo;
};

export default useEmployeePayInfo;
