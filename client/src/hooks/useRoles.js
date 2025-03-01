import { useEffect, useState } from "react";
import SettingService from "services/SettingService";

const useRoles = (company) => {
	const [roles, setRoles] = useState(null);

	useEffect(() => {
		const fetchAllRoles = async () => {
			try {
				const { data } = await SettingService.getAllRoles(company);
				setRoles(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllRoles();
	}, [company]);

	return roles;
};

export default useRoles;
