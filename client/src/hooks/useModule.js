import { useEffect, useState } from "react";
import SettingService from "services/SettingService";

const useModule = (company, refresh) => {
	const [modules, setModules] = useState(null);

	useEffect(() => {
		const fetchAllModules = async () => {
			try {
				const { data } = await SettingService.getAllModules(company);
				setModules(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (company) fetchAllModules();
	}, [company, refresh]);

	return modules;
};

export default useModule;
