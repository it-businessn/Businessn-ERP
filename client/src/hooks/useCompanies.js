import { useEffect, useState } from "react";
import SettingService from "services/SettingService";

const useCompanies = () => {
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
	}, []);

	return companies;
};

export default useCompanies;
