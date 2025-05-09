import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeBankingInfo = (company, empId) => {
	const [bankingInfo, setBankingInfo] = useState(null);
	useEffect(() => {
		const fetchEmployeeBankingInfo = async () => {
			try {
				const { data } = await PayrollService.getEmployeeBankingInfo(company, empId);
				setBankingInfo(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchEmployeeBankingInfo();
	}, [company, empId]);
	return bankingInfo;
};

export default useEmployeeBankingInfo;
