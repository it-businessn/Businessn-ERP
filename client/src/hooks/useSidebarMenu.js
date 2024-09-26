import { SIDEBAR_MENU } from "data";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";

const useSidebarMenu = (userId, company, isManager) => {
	const [activeMenu, setActiveMenu] = useState(null);

	useEffect(() => {
		const fetchUserPermissions = async () => {
			try {
				const companyName =
					company ?? LocalStorageService.getItem("selectedCompany");

				const response = await UserService.getUserPermission({
					userId,
					company: companyName,
				});

				if (response.data) {
					SIDEBAR_MENU.forEach((data, index) => {
						const menu = response.data.permissionType.find(
							(item) => item.name === data.name,
						);
						SIDEBAR_MENU[index].permissions = menu ? menu : null;
						data?.children?.forEach((child, cIndex) => {
							const childMenu = response.data.permissionType.find(
								(item) => item.name === `${data.name} ${child.name}`,
							);
							if (childMenu?.name?.includes("Setup")) {
								SIDEBAR_MENU[index].children[cIndex].permissions = isManager
									? childMenu
									: null;
							} else {
								SIDEBAR_MENU[index].children[cIndex].permissions = childMenu
									? childMenu
									: null;
							}
						});
					});
					setActiveMenu(SIDEBAR_MENU[0]);
				}
			} catch (error) {
				console.error(error);
			}
		};
		if (userId && company) {
			fetchUserPermissions();
		}
	}, [company]);
	// }, []);

	return { activeMenu, setActiveMenu };
};

export default useSidebarMenu;
