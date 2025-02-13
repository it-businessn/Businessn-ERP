import { useEffect, useState } from "react";
import SettingService from "services/SettingService";

const useCompanies = (refresh) => {
	const [companies, setCompanies] = useState(null);

	useEffect(() => {
		const fetchAllCompanies = async () => {
			try {
				const { data } = await SettingService.getAllCompanies();
				setCompanies(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllCompanies();
	}, [refresh]);

	return companies;
};

export default useCompanies;
