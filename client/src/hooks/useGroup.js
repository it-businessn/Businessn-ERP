import { useEffect, useState } from "react";
import SettingService from "services/SettingService";

const useGroup = (
	company,
	setSelectedModules,
	setSelectedAdmins,
	setGroupMembers,
	setSelectedGroup,
	isRefresh,
) => {
	const [groups, setGroups] = useState(null);

	useEffect(() => {
		const fetchAllGroups = async () => {
			try {
				const response = await SettingService.getAllGroups(company);
				setGroups(response.data);
				if (response.data.length) {
					setSelectedModules(response.data[0].modules);
					setSelectedAdmins(response.data[0].admin);
					response.data[0].members.forEach((member) => {
						member.baseModule = response.data[0].modules;
						member.group = response.data[0].name;
					});
					setGroupMembers(response.data[0].members);
					setSelectedGroup(response.data[0]);
				} else {
					setGroupMembers(null);
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
