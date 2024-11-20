import { useEffect, useState } from "react";
import SettingService from "services/SettingService";
import { isManager } from "utils";

const useGroup = (company, isRefresh, isCalendar) => {
	const [groups, setGroups] = useState(null);

	useEffect(() => {
		const fetchAllGroups = async () => {
			try {
				const response = await SettingService.getAllGroups(company);
				setGroups(response.data);
				if (response.data.length) {
					if (isCalendar) {
						response.data.forEach((data) => {
							data.members = data.members.filter(({ role }) => isManager(role));
						});
					}

					response.data[0].members.forEach((member) => {
						member.baseModule = response.data[0].modules;
						member.group = response.data[0].name;
					});
				}
			} catch (error) {
				console.error(error);
			}
		};
		if (isCalendar || isCalendar === undefined) {
			fetchAllGroups();
		}
	}, [isRefresh, company, isCalendar]);

	return groups;
};

export default useGroup;
