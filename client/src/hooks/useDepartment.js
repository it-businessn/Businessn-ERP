import { useEffect, useState } from "react";
import SettingService from "services/SettingService";

const useDepartment = (company) => {
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
	}, [company]);

	return departments;
};

export default useDepartment;
