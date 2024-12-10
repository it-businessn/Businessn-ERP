import { SIDEBAR_MENU } from "data";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "routes";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";

const useSidebarMenu = (userId, company, isManager) => {
	const [activeMenu, setActiveMenu] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUserPermissions = async () => {
			try {
				const companyName = company ?? LocalStorageService.getItem("selectedCompany");

				const { data } = await UserService.getUserPermission({
					userId,
					company: companyName,
				});

				if (data) {
					SIDEBAR_MENU.map((menuLink) => {
						const menu = data?.permissionType?.find((item) => item.name === menuLink.name);
						if (menu) {
							menuLink.permissions = menu;
						}
						menuLink?.children?.forEach((child, cIndex) => {
							const childMenu = data?.permissionType.find(
								(item) => item.name === `${menuLink.name} ${child.name}`,
							);
							if (childMenu?.name?.includes("Setup")) {
								menuLink.children[cIndex].permissions = isManager ? childMenu : null;
							} else {
								menuLink.children[cIndex].permissions = childMenu ?? null;
							}
						});
						return menuLink;
					});
					setActiveMenu(SIDEBAR_MENU.find((_) => _.permissions?.canAccessModule));
				}
			} catch (error) {
				console.error(error);
				navigate(ROUTE_PATH.LOGIN);
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
