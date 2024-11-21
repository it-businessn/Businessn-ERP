import { useEffect, useState } from "react";
import SettingService from "services/SettingService";

const useDepartment = (company) => {
	const [departments, setDepartments] = useState(null);

	useEffect(() => {
		const fetchAllDepartments = async () => {
			try {
				const response = await SettingService.getAllDepartments(company);
				setDepartments(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllDepartments();
	}, [company]);

	return departments;
};

export default useDepartment;
