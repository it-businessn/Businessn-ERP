import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeAlertsInfo = (company, payPeriodNum, isOpen, currentStep, selectedPayGroup) => {
	const [alerts, setAlerts] = useState(null);

	useEffect(() => {
		const fetchAlertsInfo = async () => {
			try {
				const { data } = await PayrollService.getAlertsDetails(
					company,
					payPeriodNum.payPeriod,
					selectedPayGroup,
				);
				setAlerts(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (payPeriodNum && currentStep === 2) {
			fetchAlertsInfo();
		}
	}, [company, payPeriodNum, isOpen, selectedPayGroup]);
	return alerts;
};

export default useEmployeeAlertsInfo;
