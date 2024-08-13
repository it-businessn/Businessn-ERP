import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeePayReport = (company, payPeriodNum, isOpen, currentStep) => {
	const [hours, setHours] = useState(null);

	useEffect(() => {
		const fetchHoursWorkedInfo = async () => {
			try {
				const response = await PayrollService.getPayReportDetails(
					company,
					payPeriodNum.payPeriod,
				);
				setHours(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		if (payPeriodNum && isOpen && currentStep === 1) {
			fetchHoursWorkedInfo();
		}
	}, [company, payPeriodNum, isOpen]);
	return hours;
};

export default useEmployeePayReport;
