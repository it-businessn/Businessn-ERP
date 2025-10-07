import { useEffect, useState } from "react";
import SettingService from "services/SettingService";
import { isNW } from "utils/common";

const useCrews = (company, refresh) => {
	const [crews, setCrews] = useState(null);
	const [selectedCrew, setSelectedCrew] = useState(null);

	useEffect(() => {
		const fetchAllCrews = async () => {
			try {
				const { data } = await SettingService.getAllCrews(company);
				setCrews(data);
				const location = isNW(company) ? "Restaurant" : data[0]?.name;
				setSelectedCrew(location);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllCrews();
	}, [company, refresh]);

	return { crews, setCrews, selectedCrew, setSelectedCrew };
};

export default useCrews;
