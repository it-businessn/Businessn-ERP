import { redirectLogin } from "api";
import { SIDEBAR_MENU } from "components/sidebar/data";
import { startTransition, useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";

const useSidebarMenu = (userId, company, isShadowAdmin) => {
	const [activeMenu, setActiveMenu] = useState(null);
	const [menuList, setMenuList] = useState(SIDEBAR_MENU);

	useEffect(() => {
		const fetchUserPermissions = async () => {
			try {
				const companyName = company || LocalStorageService.getItem("selectedCompany");
				if (isShadowAdmin) {
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
					// ACCESS-01: publish the full list; when the role became Shadow Admin
					// after load, the bar kept the previous (permission-based) list
					setMenuList([...SIDEBAR_MENU]);
					setActiveMenu(SIDEBAR_MENU.find((_) => _.permissions?.canAccessModule));
				} else {
					const newPermissions = [];
					const { data } = await UserService.getUserPermission({
						userId,
						company: companyName,
					});

					if (data) {
						SIDEBAR_MENU?.map((menu, index) => {
							const foundMenu = data?.permissionType?.find((item) => item.name === menu.name);
							if (foundMenu) {
								SIDEBAR_MENU[index].permissions = foundMenu;
							}
							const updatedChildren = menu.children?.map((child) => {
								const foundChild = data?.permissionType?.find(
									(item) => item.name === `${menu.name} ${child.name}`,
								);
								return {
									...child,
									permissions: foundChild,
								};
							});
							newPermissions.push({
								...menu,
								permissions: foundMenu,
								children: updatedChildren,
							});
							return {
								...menu,
								permissions: foundMenu,
								children: updatedChildren,
							};
						});
						setMenuList(newPermissions);
						setActiveMenu(newPermissions?.find((_) => _.permissions?.canAccessModule));
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
		// ACCESS-01: also rebuild the modules when the role changes (e.g. to Shadow Admin)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [company, isShadowAdmin]);

	return { activeMenu, setActiveMenu, menuList };
};

export default useSidebarMenu;
