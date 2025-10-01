import { useEffect, useState } from "react";
import SettingService from "services/SettingService";

const useSelectedCompanyInfo = (company, refresh) => {
	const [companyInfo, setCompanyInfo] = useState(null);

	useEffect(() => {
		const fetchCompanyInfo = async () => {
			try {
				const { data } = await SettingService.getCompanyInfo(company);
				setCompanyInfo(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchCompanyInfo();
	}, [company, refresh]);

	return companyInfo;
};

export default useSelectedCompanyInfo;
