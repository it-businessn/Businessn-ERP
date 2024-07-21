import { useEffect, useState } from "react";
import SettingService from "services/SettingService";

const useSettings = (key) => {
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchSettings = async () => {
			const configuration = await SettingService.getConfigurationsByName(key);
			configuration.data.items.forEach((_) => setData([...data, _.name]));
		};
		fetchSettings();
	}, []);

	return data;
};

export default useSettings;
