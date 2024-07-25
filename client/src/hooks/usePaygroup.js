import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const usePaygroup = (company) => {
	const [payGroups, setPayGroups] = useState(null);
	const [selectedPayGroup, setSelectedPayGroup] = useState(null);

	useEffect(() => {
		const fetchAllPaygroups = async () => {
			try {
				const response = await PayrollService.getAllPaygroups(company);
				setPayGroups(response.data);
				if (response.data.length) {
					setSelectedPayGroup(response.data[0].name);
				}
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllPaygroups();
	}, [company]);
	return { payGroups, selectedPayGroup, setSelectedPayGroup };
};

export default usePaygroup;
