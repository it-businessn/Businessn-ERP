import {
	Box,
	HStack,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import Loader from "components/Loader";
import { SIDEBAR_MENU } from "components/sidebar/data";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { GoCheckCircleFill } from "react-icons/go";
import { IoMdCloseCircle } from "react-icons/io";
import { useLocation } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";
import EmpSearchMenu from "../EmpSearchMenu";

const PermissionsPanel = ({
	employees,
	setFilteredEmployees,
	filteredEmployees,
}) => {
	const [isRefresh, setIsRefresh] = useState(false);
	const [empName, setEmpName] = useState(null);
	const [userPermission, setUserPermission] = useState(null);
	const location = useLocation();

	const currentModule = location.pathname.split("/")[1];
	const defaultIndex = SIDEBAR_MENU.findIndex(
		(menu) => menu.id === currentModule,
	);
	const [isExpanded, setExpanded] = useState(defaultIndex);
	const [children, setChildren] = useState(null);

	const [userId, setUserId] = useState(LocalStorageService.getItem("user")._id);

	useEffect(() => {
		const fetchUserPermissions = async () => {
			try {
				const response = await UserService.getUserPermission(userId);

				if (response.data) {
					SIDEBAR_MENU.forEach((data, index) => {
						const menu = response.data.permissionType.find(
							(item) => item.name === data.name,
						);
						if (menu) {
							SIDEBAR_MENU[index].permissions = menu;
						}
						data?.children?.forEach((child, cIndex) => {
							const childMenu = response.data.permissionType.find(
								(item) => item.name === `${data.name} ${child.name}`,
							);
							if (menu) {
								SIDEBAR_MENU[index].children[cIndex].permissions = childMenu;
							}
						});
					});
					setUserPermission(response.data);
				} else {
					setUserPermission(null);
				}
			} catch (error) {
				console.error(error);
			}
		};

		fetchUserPermissions();
	}, [isRefresh, userId]);

	const handleSubmit = async (emp) => {
		setUserId(emp._id);
	};

	const handleInputChange = (value) => {
		setEmpName(value);
		setFilteredEmployees(
			employees.filter((emp) =>
				emp?.fullName?.toLowerCase().includes(value.toLowerCase()),
			),
		);
	};

	const handleSelect = (emp) => {
		setEmpName(emp.fullName);
		setFilteredEmployees(
			employees.filter((emp) =>
				emp?.fullName?.toLowerCase().includes(emp.fullName.toLowerCase()),
			),
		);
		handleSubmit(emp);
	};

	const handleToggle = (index, list) => {
		setExpanded(isExpanded === index ? -1 : index);
		setChildren(list);
	};

	const handleTogglePermission = async (value) => {
		if (!value.isParent) {
			value.name = `${value.name} ${value.child}`;
		}
		const isUserPermissionExists = userPermission?.empId === userId;
		try {
			if (isUserPermissionExists) {
				await UserService.updateUserPermission(value, userId);
			} else {
				value.empId = userId;
				await UserService.addUserPermission(value);
			}
			setIsRefresh((prev) => !prev);
		} catch (error) {
			console.error(error);
		}
	};
	const AccessBox = ({ menu, child, isParent, accessName, permissions }) => {
		const accessIcon = () =>
			userPermission && permissions ? (
				<GoCheckCircleFill color={"green"} />
			) : (
				<IoMdCloseCircle color={"red"} />
			);

		return (
			<Box cursor={"pointer"}>
				{isParent ? (
					<Box
						onClick={(e) => {
							e.preventDefault();
							handleTogglePermission({
								name: menu,
								isParent: true,
								accessName,
							});
						}}
					>
						{accessIcon()}
					</Box>
				) : (
					<Box
						mt={3}
						onClick={(e) => {
							e.preventDefault();
							handleTogglePermission({
								name: menu,
								isParent: false,
								accessName,
								child,
							});
						}}
					>
						{accessIcon()}
					</Box>
				)}
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
			{!employees && <Loader isAuto />}
			{employees && (
				<Table variant="simple">
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
						{SIDEBAR_MENU.map((menu, index) => (
							<Tr key={menu.id}>
								<Td w={"550px"} key={menu.name} py={1}>
									<HStack spacing={2}>
										{menu.children.length > 0 && (
											<FaChevronDown
												onClick={(e) => {
													e.preventDefault();
													handleToggle(index, menu.children);
												}}
											/>
										)}
										<Text>{menu.name}</Text>
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
									/>
									{isExpanded === index &&
										menu.children?.length > 0 &&
										menu.children.map((child) => (
											<AccessBox
												key={`${child.name}module`}
												menu={menu.name}
												permissions={child?.permissions?.canAccessModule}
												child={child.name}
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
									/>
									{isExpanded === index &&
										menu.children?.length > 0 &&
										menu.children.map((child) => (
											<AccessBox
												key={`${child.name}user`}
												menu={menu.name}
												child={child.name}
												permissions={child?.permissions?.canAccessUserData}
												accessName="canAccessUserData"
											/>
										))}
								</Td>
								<Td w={"50px"} py={1}>
									<AccessBox
										menu={menu.name}
										isParent
										accessName="canAccessGroupData"
										permissions={menu?.permissions?.canAccessGroupData}
									/>
									{isExpanded === index &&
										menu.children?.length > 0 &&
										menu.children.map((child) => (
											<AccessBox
												key={`${child.name}group`}
												menu={menu.name}
												child={child.name}
												permissions={child?.permissions?.canAccessGroupData}
												accessName="canAccessGroupData"
											/>
										))}
								</Td>
								<Td w={"50px"} py={1}>
									<AccessBox
										menu={menu.name}
										isParent
										accessName="canAccessRegionData"
										permissions={menu?.permissions?.canAccessRegionData}
									/>
									{isExpanded === index &&
										menu.children?.length > 0 &&
										menu.children.map((child) => (
											<AccessBox
												key={`${child.name}reg`}
												menu={menu.name}
												child={child.name}
												permissions={child?.permissions?.canAccessRegionData}
												accessName="canAccessRegionData"
											/>
										))}
								</Td>
								<Td w={"50px"} py={1}>
									<AccessBox
										menu={menu.name}
										isParent
										accessName="canAccessAllData"
										permissions={menu?.permissions?.canAccessAllData}
									/>
									{isExpanded === index &&
										menu.children?.length > 0 &&
										menu.children.map((child) => (
											<AccessBox
												key={`${child.name}all`}
												menu={menu.name}
												child={child.name}
												permissions={child?.permissions?.canAccessAllData}
												accessName="canAccessAllData"
											/>
										))}
								</Td>
								<Td w={"50px"} py={1}>
									<AccessBox
										menu={menu.name}
										isParent
										accessName="canViewModule"
										permissions={menu?.permissions?.canViewModule}
									/>
									{isExpanded === index &&
										menu.children?.length > 0 &&
										menu.children.map((child) => (
											<AccessBox
												key={`${child.name}view`}
												menu={menu.name}
												child={child.name}
												permissions={child?.permissions?.canViewModule}
												accessName="canViewModule"
											/>
										))}
								</Td>
								<Td w={"50px"} py={1}>
									<AccessBox
										menu={menu.name}
										isParent
										accessName="canEditModule"
										permissions={menu?.permissions?.canEditModule}
									/>
									{isExpanded === index &&
										menu.children?.length > 0 &&
										menu.children.map((child) => (
											<AccessBox
												key={`${child.name}edit`}
												menu={menu.name}
												child={child.name}
												permissions={child?.permissions?.canEditModule}
												accessName="canEditModule"
											/>
										))}
								</Td>
								<Td w={"50px"} py={1}>
									<AccessBox
										menu={menu.name}
										isParent
										accessName="canDeleteModule"
										permissions={menu?.permissions?.canDeleteModule}
									/>
									{isExpanded === index &&
										menu.children?.length > 0 &&
										menu.children.map((child) => (
											<AccessBox
												key={`${child.name}del`}
												menu={menu.name}
												child={child.name}
												permissions={child?.permissions?.canDeleteModule}
												accessName="canDeleteModule"
											/>
										))}
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			)}
		</>
	);
};

export default PermissionsPanel;
