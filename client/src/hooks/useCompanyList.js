import { useEffect, useState } from "react";
import SettingService from "services/SettingService";

const useCompanyList = (userId) => {
	const [companies, setCompanies] = useState(null);

	useEffect(() => {
		const fetchCompanyInfo = async () => {
			try {
				const response = await SettingService.getAllCompaniesByUser(userId);
				setCompanies(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchCompanyInfo();
	}, []);

	return companies;
};

export default useCompanyList;
