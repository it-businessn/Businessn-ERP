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
					SIDEBAR_MENU.map((data) => {
						const menu = response.data.permissionType.find(
							(item) => item.name === data.name,
						);
						if (menu) {
							data.permissions = menu;
						}
						data?.children?.forEach((child, cIndex) => {
							const childMenu = response.data.permissionType.find(
								(item) => item.name === `${data.name} ${child.name}`,
							);
							if (childMenu?.name?.includes("Setup")) {
								data.children[cIndex].permissions = isManager
									? childMenu
									: null;
							} else {
								data.children[cIndex].permissions = childMenu ?? null;
							}
						});
						return data;
					});
					setActiveMenu(
						SIDEBAR_MENU.find((_) => _.permissions?.canAccessModule),
					);
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
