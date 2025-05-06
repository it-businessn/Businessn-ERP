import { useEffect, useState } from "react";
import SettingService from "services/SettingService";

const useRoles = (company, refresh) => {
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
	}, [company, refresh]);

	return roles;
};

export default useRoles;
