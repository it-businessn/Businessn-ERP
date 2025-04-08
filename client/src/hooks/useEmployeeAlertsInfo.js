import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeAlertsInfo = (company, payPeriodNum, isOpen, currentStep) => {
	const [alerts, setAlerts] = useState(null);

	useEffect(() => {
		const fetchAlertsInfo = async () => {
			try {
				const { data } = await PayrollService.getAlertsDetails(company, payPeriodNum.payPeriod);
				setAlerts(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (payPeriodNum && currentStep === 2) {
			fetchAlertsInfo();
		}
	}, [company, payPeriodNum, isOpen]);
	return alerts;
};

export default useEmployeeAlertsInfo;
