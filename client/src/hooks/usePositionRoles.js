import { useEffect, useState } from "react";
import SettingService from "services/SettingService";

const usePositionRoles = (company, refresh) => {
	const [positionRoles, setPositionRoles] = useState(null);

	useEffect(() => {
		const fetchAllEmploymentRoles = async () => {
			try {
				const { data } = await SettingService.getAllPositionRoles(company);
				setPositionRoles(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllEmploymentRoles();
	}, [company, refresh]);

	return positionRoles;
};

export default usePositionRoles;
