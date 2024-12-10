import { useEffect, useState } from "react";
import SettingService from "services/SettingService";

const useUserAssociatedCompanies = (userId) => {
	const [companies, setCompanies] = useState(null);

	useEffect(() => {
		const fetchCompanyInfo = async () => {
			try {
				const { data } = await SettingService.getAllCompaniesByUser(userId);
				setCompanies(data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchCompanyInfo();
	}, []);

	return companies;
};

export default useUserAssociatedCompanies;
