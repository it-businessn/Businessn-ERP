import { useEffect, useState } from "react";
import SettingService from "services/SettingService";

const useSelectedCompanyInfo = (company) => {
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
	}, [company]);

	return companyInfo;
};

export default useSelectedCompanyInfo;
