import { redirectLogin } from "api";
import { COMPANIES } from "constant";
import { SIDEBAR_MENU } from "data";
import { startTransition, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";

const useSidebarMenu = (userId, company, isManager, isShadowAdmin) => {
	const [activeMenu, setActiveMenu] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUserPermissions = async () => {
			try {
				const companyName = company || LocalStorageService.getItem("selectedCompany");
				if (isShadowAdmin || companyName === COMPANIES.BUSINESSN_ORG) {
					const permissionMenu = {
						canAccessAllData: true,
						canAccessGroupData: true,
						canAccessModule: true,
						canAccessRegionData: true,
						canAccessUserData: true,
						canDeleteModule: true,
						canEditModule: true,
						canViewModule: true,
					};
					SIDEBAR_MENU?.map((menuLink) => {
						permissionMenu.name = menuLink.name;

						menuLink.permissions = permissionMenu;

						menuLink?.children?.forEach((child, cIndex) => {
							permissionMenu.name = `${menuLink?.name} ${child?.name}`;
							menuLink.children[cIndex].permissions = permissionMenu;
						});
						return menuLink;
					});
					setActiveMenu(SIDEBAR_MENU.find((_) => _.permissions?.canAccessModule));
				} else {
					const { data } = await UserService.getUserPermission({
						userId,
						company: companyName,
					});

					if (data) {
						SIDEBAR_MENU?.map((menuLink) => {
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
									menuLink.children[cIndex].permissions = childMenu || null;
								}
							});
							return menuLink;
						});
						setActiveMenu(SIDEBAR_MENU.find((_) => _.permissions?.canAccessModule));
					}
				}
			} catch (error) {
				startTransition(() => {
					redirectLogin();
				});
			}
		};
		if (userId && company) {
			fetchUserPermissions();
		}
	}, [company]);
	return { activeMenu, setActiveMenu };
};

export default useSidebarMenu;
