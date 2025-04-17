import { useEffect, useState } from "react";
import SettingService from "services/SettingService";

const useWorkLocations = (company, refresh) => {
	const [locations, setLocations] = useState(null);
	useEffect(() => {
		const fetchAllLocation = async () => {
			try {
				const { data } = await SettingService.getAllLocations(company);
				setLocations(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllLocation();
	}, [company, refresh]);

	return locations;
};

export default useWorkLocations;
