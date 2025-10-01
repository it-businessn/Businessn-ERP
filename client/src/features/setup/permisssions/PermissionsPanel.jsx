import { Box, HStack, Switch, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";

import { SIDEBAR_MENU } from "components/sidebar/data";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";
import EmpSearchMenu from "../company/group-tab/EmpSearchMenu";

const PermissionsPanel = ({ employees, setFilteredEmployees, filteredEmployees, company }) => {
	const [isRefresh, setIsRefresh] = useState(false);
	const [empName, setEmpName] = useState("");
	const [userPermission, setUserPermission] = useState(null);
	const [showLoader, setShowLoader] = useState(false);
	const location = useLocation();
	const currentModule = location.pathname.split("/")[1];
	const defaultIndex = SIDEBAR_MENU?.findIndex((menu) => menu.id === currentModule);
	const [isExpanded, setExpanded] = useState(defaultIndex);
	const [children, setChildren] = useState(null);
	const [menuList, setMenuList] = useState(null);
	const [userId, setUserId] = useState(LocalStorageService.getItem("user")._id);

	useEffect(() => {
		const fetchUserPermissions = async () => {
			setShowLoader(true);
			try {
				const { data } = await UserService.getUserPermission({
					userId,
					company,
				});
				if (data) {
					const newPermissions = [];
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
					setUserPermission(data);
				} else {
					setUserPermission(null);
				}
				setShowLoader(false);
			} catch (error) {
				setShowLoader(false);
				console.error(error);
			}
		};

		fetchUserPermissions();
	}, [isRefresh, userId, company]);

	const handleSubmit = async (emp) => {
		setUserId(emp._id);
	};

	const handleInputChange = (value) => {
		setEmpName(value);
		setFilteredEmployees(
			employees.filter((emp) => emp?.fullName?.toLowerCase().includes(value.toLowerCase())),
		);
	};

	const handleSelect = (emp) => {
		setEmpName(emp.fullName);
		setFilteredEmployees(
			employees.filter((emp) => emp?.fullName?.toLowerCase().includes(emp.fullName.toLowerCase())),
		);
		handleSubmit(emp);
	};

	const handleToggle = (index, list) => {
		setExpanded(isExpanded === index ? -1 : index);
		setChildren(list);
	};

	const handleTogglePermission = async (value) => {
		const { isParent, pIndex, cIndex, accessName, name, child } = value;
		setMenuList((prev) => {
			const copy = [...prev];
			if (isParent) {
				copy[pIndex] = {
					...copy[pIndex],
					permissions: {
						...copy[pIndex].permissions,
						[accessName]: !copy[pIndex].permissions?.[accessName],
					},
				};
			} else {
				const childrenCopy = [...copy[pIndex].children];
				childrenCopy[cIndex] = {
					...childrenCopy[cIndex],
					permissions: {
						...childrenCopy[cIndex].permissions,
						[accessName]: !childrenCopy[cIndex].permissions?.[accessName],
					},
				};
				copy[pIndex] = {
					...copy[pIndex],
					children: childrenCopy,
				};
			}

			return copy;
		});
		const payload = {
			...value,
			name: isParent ? name : `${name} ${child}`,
			companyName: company,
			empId: userId,
		};
		if (!value.isParent) {
			value.name = `${value.name} ${value.child}`;
		}
		const isUserPermissionExists = userPermission?.empId === userId;
		try {
			if (isUserPermissionExists) {
				value.companyName = company;
				await UserService.updateUserPermission(payload, userId);
			} else {
				await UserService.addUserPermission(payload);
			}
		} catch (error) {
			setShowLoader(false);
			console.error(error);
		}
	};

	const AccessBox = ({ menu, child, isParent, accessName, permissions, pIndex, cIndex }) => {
		return (
			<Box cursor={"pointer"} mt={isParent ? 0 : 1}>
				<Switch
					isChecked={permissions ?? false}
					colorScheme="facebook"
					onChange={() => {
						handleTogglePermission({
							name: menu,
							isParent,
							accessName,
							child,
							pIndex,
							cIndex,
						});
					}}
				/>
			</Box>
		);
	};
	return (
		<>
			<HStack>
				<EmpSearchMenu
					filteredEmployees={filteredEmployees}
					empName={empName}
					handleInputChange={handleInputChange}
					handleSelect={handleSelect}
				/>
			</HStack>
			<Table variant="simple" bg={"var(--payStub_bg)"}>
				<Thead>
					<Tr>
						<Th>Section</Th>
						<Th>Section Access</Th>
						<Th>User Data</Th>
						<Th>Group Data</Th>
						<Th>Region Data</Th>
						<Th>All Data</Th>
						<Th>View</Th>
						<Th>Edit</Th>
						<Th>Delete</Th>
					</Tr>
				</Thead>
				<Tbody>
					{showLoader && <EmptyRowRecord data={showLoader} colSpan={10} />}
					{!showLoader &&
						menuList?.map((menu, index) => {
							return (
								<Tr key={menu.id}>
									<Td w={1} key={menu.name} py={1}>
										<HStack
											spacing={2}
											cursor={"pointer"}
											onClick={() => handleToggle(index, menu.children)}
										>
											{menu.children.length > 0 && <FaChevronDown />}
											<NormalTextTitle title={menu.name} size="sm" whiteSpace={"nowrap"} />
										</HStack>
										{isExpanded === index &&
											menu.children?.length > 0 &&
											menu.children.map((child) => (
												<Box mt={1.5} key={child.name}>
													<Text>{child.name}</Text>
												</Box>
											))}
									</Td>
									<Td w={"50px"} py={1}>
										<AccessBox
											permissions={menu?.permissions?.canAccessModule}
											menu={menu.name}
											isParent
											accessName="canAccessModule"
											pIndex={index}
										/>
										{isExpanded === index &&
											menu.children?.length > 0 &&
											menu.children.map((child, cIndex) => (
												<AccessBox
													key={`${child.name}_module`}
													menu={menu.name}
													permissions={child?.permissions?.canAccessModule}
													child={child.name}
													pIndex={index}
													cIndex={cIndex}
													accessName="canAccessModule"
												/>
											))}
									</Td>
									<Td w={"50px"} py={1}>
										<AccessBox
											menu={menu.name}
											isParent
											accessName="canAccessUserData"
											permissions={menu?.permissions?.canAccessUserData}
											pIndex={index}
										/>
										{isExpanded === index &&
											menu.children?.length > 0 &&
											menu.children.map((child, cIndex) => (
												<AccessBox
													key={`${child.name}_user`}
													menu={menu.name}
													child={child.name}
													permissions={child?.permissions?.canAccessUserData}
													accessName="canAccessUserData"
													pIndex={index}
													cIndex={cIndex}
												/>
											))}
									</Td>
									<Td w={"50px"} py={1}>
										<AccessBox
											menu={menu.name}
											isParent
											accessName="canAccessGroupData"
											permissions={menu?.permissions?.canAccessGroupData}
											pIndex={index}
										/>
										{isExpanded === index &&
											menu.children?.length > 0 &&
											menu.children.map((child, cIndex) => (
												<AccessBox
													key={`${child.name}_group`}
													menu={menu.name}
													child={child.name}
													permissions={child?.permissions?.canAccessGroupData}
													accessName="canAccessGroupData"
													pIndex={index}
													cIndex={cIndex}
												/>
											))}
									</Td>
									<Td w={"50px"} py={1}>
										<AccessBox
											menu={menu.name}
											isParent
											accessName="canAccessRegionData"
											permissions={menu?.permissions?.canAccessRegionData}
											pIndex={index}
										/>
										{isExpanded === index &&
											menu.children?.length > 0 &&
											menu.children.map((child, cIndex) => (
												<AccessBox
													key={`${child.name}_reg`}
													menu={menu.name}
													child={child.name}
													permissions={child?.permissions?.canAccessRegionData}
													accessName="canAccessRegionData"
													pIndex={index}
													cIndex={cIndex}
												/>
											))}
									</Td>
									<Td w={"50px"} py={1}>
										<AccessBox
											menu={menu.name}
											isParent
											accessName="canAccessAllData"
											permissions={menu?.permissions?.canAccessAllData}
											pIndex={index}
										/>
										{isExpanded === index &&
											menu.children?.length > 0 &&
											menu.children.map((child, cIndex) => (
												<AccessBox
													key={`${child.name}_all`}
													menu={menu.name}
													child={child.name}
													permissions={child?.permissions?.canAccessAllData}
													accessName="canAccessAllData"
													pIndex={index}
													cIndex={cIndex}
												/>
											))}
									</Td>
									<Td w={"50px"} py={1}>
										<AccessBox
											menu={menu.name}
											isParent
											accessName="canViewModule"
											permissions={menu?.permissions?.canViewModule}
											pIndex={index}
										/>
										{isExpanded === index &&
											menu.children?.length > 0 &&
											menu.children.map((child, cIndex) => (
												<AccessBox
													key={`${child.name}_view`}
													menu={menu.name}
													child={child.name}
													permissions={child?.permissions?.canViewModule}
													accessName="canViewModule"
													pIndex={index}
													cIndex={cIndex}
												/>
											))}
									</Td>
									<Td w={"50px"} py={1}>
										<AccessBox
											menu={menu.name}
											isParent
											accessName="canEditModule"
											permissions={menu?.permissions?.canEditModule}
											pIndex={index}
										/>
										{isExpanded === index &&
											menu.children?.length > 0 &&
											menu.children.map((child, cIndex) => (
												<AccessBox
													key={`${child.name}_edit`}
													menu={menu.name}
													child={child.name}
													permissions={child?.permissions?.canEditModule}
													accessName="canEditModule"
													pIndex={index}
													cIndex={cIndex}
												/>
											))}
									</Td>
									<Td w={"50px"} py={1}>
										<AccessBox
											menu={menu.name}
											isParent
											accessName="canDeleteModule"
											permissions={menu?.permissions?.canDeleteModule}
											pIndex={index}
										/>
										{isExpanded === index &&
											menu.children?.length > 0 &&
											menu.children.map((child, cIndex) => (
												<AccessBox
													key={`${child.name}_del`}
													menu={menu.name}
													child={child.name}
													permissions={child?.permissions?.canDeleteModule}
													accessName="canDeleteModule"
													pIndex={index}
													cIndex={cIndex}
												/>
											))}
									</Td>
								</Tr>
							);
						})}
				</Tbody>
			</Table>
		</>
	);
};

export default PermissionsPanel;
