import { useEffect, useState } from "react";
import SettingService from "services/SettingService";

const useGroup = (company, isRefresh) => {
	const [groups, setGroups] = useState(null);

	useEffect(() => {
		const fetchAllGroups = async () => {
			try {
				const response = await SettingService.getAllGroups(company);
				setGroups(response.data);
				if (response.data.length) {
					response.data[0].members.forEach((member) => {
						member.baseModule = response.data[0].modules;
						member.group = response.data[0].name;
					});
				}
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllGroups();
	}, [isRefresh, company]);

	return groups;
};

export default useGroup;
