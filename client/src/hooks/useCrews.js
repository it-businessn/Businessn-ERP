import { useEffect, useState } from "react";
import SettingService from "services/SettingService";

const useCrews = (company, refresh) => {
	const [crews, setCrews] = useState(null);
	const [selectedCrew, setSelectedCrew] = useState(null);

	useEffect(() => {
		const fetchAllCrews = async () => {
			try {
				const { data } = await SettingService.getAllCrews(company);
				setCrews(data);
				setSelectedCrew(data[0]?.name);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllCrews();
	}, [company, refresh]);

	return { crews, setCrews, selectedCrew, setSelectedCrew };
};

export default useCrews;
