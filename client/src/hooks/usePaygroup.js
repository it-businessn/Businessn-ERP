import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const usePaygroup = (company) => {
	const [payGroups, setPayGroups] = useState(null);
	useEffect(() => {
		const fetchAllPaygroups = async () => {
			try {
				const response = await PayrollService.getAllPaygroups(company);
				setPayGroups(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllPaygroups();
	}, [company]);
	return payGroups;
};

export default usePaygroup;
