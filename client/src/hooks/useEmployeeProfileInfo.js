import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const useEmployeeProfileInfo = (company, empId) => {
	const [profileInfo, setProfileInfo] = useState(null);
	useEffect(() => {
		const fetchEmployeeProfileInfo = async () => {
			try {
				const response = await PayrollService.getEmployeeProfileInfo(
					company,
					empId,
				);
				setProfileInfo(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchEmployeeProfileInfo();
	}, [company, empId]);
	return profileInfo;
};

export default useEmployeeProfileInfo;
