import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const usePaygroup = (company, refresh) => {
	const [payGroups, setPayGroups] = useState(null);
	const [selectedPayGroup, setSelectedPayGroup] = useState(null);
	const [payGroupSchedule, setPayGroupSchedule] = useState(null);

	useEffect(() => {
		const fetchAllPaygroups = async () => {
			try {
				const response = await PayrollService.getAllPaygroups(company);
				setPayGroups(response.data);
				if (response.data.length) {
					setSelectedPayGroup(response.data[0]);
					setPayGroupSchedule(response.data[0]?.scheduleSettings);
				}
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllPaygroups();
	}, [company, refresh]);
	return { payGroups, selectedPayGroup, setSelectedPayGroup, payGroupSchedule };
};

export default usePaygroup;
