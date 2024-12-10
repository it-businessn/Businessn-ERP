import { useEffect, useState } from "react";
import SettingService from "services/SettingService";
import { isManager } from "utils";

const useGroup = (company, isRefresh, isCalendar) => {
	const [groups, setGroups] = useState(null);

	useEffect(() => {
		const fetchAllGroups = async () => {
			try {
				const { data } = await SettingService.getAllGroups(company);
				setGroups(data);
				if (data.length) {
					if (isCalendar) {
						data.forEach((data) => {
							data.members = data.members.filter(({ role }) => isManager(role));
						});
					}

					data[0].members.forEach((member) => {
						member.baseModule = data[0].modules;
						member.group = data[0].name;
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
