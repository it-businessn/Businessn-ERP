import { useEffect, useState } from "react";
import SettingService from "services/SettingService";

const useDepartment = (company, refresh) => {
	const [departments, setDepartments] = useState(null);

	useEffect(() => {
		const fetchAllDepartments = async () => {
			try {
				const { data } = await SettingService.getAllDepartments(company);
				setDepartments(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllDepartments();
	}, [company, refresh]);

	return departments;
};

export default useDepartment;
