import { useEffect, useState } from "react";
import SettingService from "services/SettingService";

const useCostCenter = (company, refresh) => {
	const [cc, setCC] = useState(null);

	useEffect(() => {
		const fetchAllCC = async () => {
			try {
				const { data } = await SettingService.getAllCC(company);
				setCC(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllCC();
	}, [company, refresh]);

	return cc;
};

export default useCostCenter;
