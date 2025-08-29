import { useEffect, useState } from "react";
import UserService from "services/UserService";

const useManager = (company) => {
	const [managers, setManagers] = useState(null);

	useEffect(() => {
		const fetchAllManagers = async () => {
			try {
				const { data } = await UserService.getAllCompManagers(company);
				data.map((emp) => {
					emp.fullName = emp?.empId?.fullName;
					emp._id = emp?.empId?._id;
					emp.id = emp._id;
					return emp;
				});
				setManagers(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllManagers();
	}, [company]);

	return managers;
};

export default useManager;
