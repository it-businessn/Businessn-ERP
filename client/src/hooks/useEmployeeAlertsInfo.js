import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeAlertsInfo = (company, payPeriodNum, isOpen, currentStep) => {
	const [alerts, setAlerts] = useState(null);

	useEffect(() => {
		const fetchAlertsInfo = async () => {
			try {
				const response = await PayrollService.getAlertsDetails(
					company,
					payPeriodNum.payPeriod,
				);
				setAlerts(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		if (payPeriodNum && isOpen && currentStep === 2) {
			fetchAlertsInfo();
		}
	}, [company, payPeriodNum, isOpen]);
	return alerts;
};

export default useEmployeeAlertsInfo;
