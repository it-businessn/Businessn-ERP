import { SmallAddIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	HStack,
	Select,
	Spacer,
	Text,
} from "@chakra-ui/react";
import Loader from "components/Loader";
import LeftIconButton from "components/ui/button/LeftIconButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import MultiSelectBox from "components/ui/form/select/MultiSelectBox";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import SettingService from "services/SettingService";
import UserService from "services/UserService";
import AddNewGroup from "../AddNewGroup";
import EmpSearchMenu from "../EmpSearchMenu";
import UserList from "../UserList";

const GroupsPanel = ({
	employees,
	setFilteredEmployees,
	filteredEmployees,
	company,
}) => {
	const [groups, setGroups] = useState(null);
	const [groupMembers, setGroupMembers] = useState(null);
	const [selectedGroup, setSelectedGroup] = useState(null);
	const [modules, setModules] = useState(null);
	const [admins, setAdmins] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isRefresh, setIsRefresh] = useState(false);

	const [openAdminMenu, setOpenAdminMenu] = useState(null);
	const [openModuleMenu, setOpenModuleMenu] = useState(null);
	const [selectedModules, setSelectedModules] = useState(null);
	const [selectedAdmins, setSelectedAdmins] = useState(null);
	const [empName, setEmpName] = useState(null);
	const [openAddGroup, setOpenAddGroup] = useState(false);

	useEffect(() => {
		const fetchAllModules = async () => {
			try {
				const response = await SettingService.getAllModules(company);
				setModules(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		const fetchAllManagers = async () => {
			try {
				const response = await UserService.getAllManagers(company);
				setAdmins(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllManagers();
		fetchAllModules();
	}, [company]);

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
		setFilteredEmployees(employees.filter((item) => item?.email === emp.email));
	};

	const handleMenuToggle = () => {
		setOpenModuleMenu((prev) => !prev);
	};

	const handleCloseMenu = (selectedOptions) => {
		setOpenModuleMenu(false);
		setSelectedModules(selectedOptions);
	};

	const handleAdminMenuToggle = () => {
		setOpenAdminMenu((prev) => !prev);
	};

	const handleAdminCloseMenu = (selectedOptions) => {
		setOpenAdminMenu(false);
		setSelectedAdmins(selectedOptions);
	};

	const handleConfirm = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		selectedGroup.admin = selectedAdmins;
		selectedGroup.modules = selectedModules;
		const memberExists = selectedGroup.members.findIndex(
			(member) => member.email === filteredEmployees[0].email,
		);
		if (memberExists === -1) {
			selectedGroup.members.push(filteredEmployees[0]);
			try {
				await SettingService.updateGroup(selectedGroup, selectedGroup._id);
				setIsRefresh((prev) => !prev);
				setFilteredEmployees(employees);
				setEmpName("");
			} catch (error) {
				console.log("An error occurred. Please try again.");
			} finally {
				setIsSubmitting(false);
			}
			return;
		}
		setFilteredEmployees(employees);
		setEmpName("");
		setIsSubmitting(false);
	};
	const handleGroup = (e) => {
		const item = groups.find((name) => name.name === e.target.value);
		if (!item) {
			return;
		}
		setSelectedGroup(item);
		setSelectedModules(item.modules);
		setSelectedAdmins(item.admin);
		item.members.forEach((member) => {
			member.baseModule = item.modules;
			member.group = item.name;
		});
		setGroupMembers(item.members);
	};
	return (
		<Box
			p="1em"
			bg={"brand.primary_bg"}
			border="3px solid var(--main_color)"
			borderRadius="10px"
			fontWeight="bold"
		>
			<HStack>
				<PrimaryButton
					size="sm"
					name={"Add Group"}
					isLoading={isSubmitting}
					onOpen={() => setOpenAddGroup(true)}
				/>
				{openAddGroup && (
					<AddNewGroup
						modules={modules}
						admins={admins}
						isOpen={openAddGroup}
						onClose={() => setOpenAddGroup(false)}
						setRefresh={setIsRefresh}
					/>
				)}
			</HStack>
			{(!modules || !groups || !admins) && <Loader autoHeight />}
			<HStack>
				{groups && (
					<FormControl>
						<FormLabel> Group </FormLabel>
						<Select
							icon={<FaCaretDown />}
							borderRadius="10px"
							value={selectedGroup?.name}
							placeholder="Select Group"
							onChange={handleGroup}
						>
							{groups?.map((group) => (
								<option value={group.name} key={group._id}>
									{group.name}
								</option>
							))}
						</Select>
					</FormControl>
				)}
				{modules && (
					<FormControl>
						<FormLabel visibility={openModuleMenu ? "" : "hidden"}>
							Select Base Module
						</FormLabel>
						<Button
							rightIcon={<FaCaretDown />}
							bg={"brand.primary_bg"}
							color={"brand.primary_button_bg"}
							_hover={{
								bg: "brand.primary_bg",
								color: "brand.primary_button_bg",
							}}
						>
							{openModuleMenu ? (
								<MultiSelectBox
									data={modules}
									openMenu={openModuleMenu}
									selectedOptions={selectedModules}
									handleCloseMenu={handleCloseMenu}
									setSelectedOptions={setSelectedModules}
								/>
							) : (
								<Text onClick={handleMenuToggle}>
									{selectedModules?.length > 0
										? `${selectedModules?.length} modules`
										: "Select Base Module"}
								</Text>
							)}
						</Button>
					</FormControl>
				)}
				{admins && (
					<FormControl>
						<FormLabel visibility={openAdminMenu ? "" : "hidden"}>
							Group Admin
						</FormLabel>
						<Button
							rightIcon={<FaCaretDown />}
							bg={"brand.primary_bg"}
							color={"brand.primary_button_bg"}
							_hover={{
								bg: "brand.primary_bg",
								color: "brand.primary_button_bg",
							}}
						>
							{openAdminMenu ? (
								<MultiSelectBox
									data={admins}
									openMenu={openAdminMenu}
									selectedOptions={selectedAdmins}
									handleCloseMenu={handleAdminCloseMenu}
									setSelectedOptions={setSelectedAdmins}
								/>
							) : (
								<Text onClick={handleAdminMenuToggle}>
									{selectedAdmins?.length > 0
										? `${selectedAdmins?.length} modules`
										: "Select Group Admin"}
								</Text>
							)}
						</Button>
					</FormControl>
				)}
			</HStack>
			<Box
				p="1em"
				bg={"brand.primary_bg"}
				border="3px solid var(--main_color)"
				borderRadius="10px"
			>
				<HStack justify={"space-between"}>
					<Text fontWeight="bold">{groupMembers?.length} User(s)</Text>

					<Spacer />
					<EmpSearchMenu
						filteredEmployees={filteredEmployees}
						empName={empName}
						handleInputChange={handleInputChange}
						handleSelect={handleSelect}
					/>
					<LeftIconButton
						name={"Add User"}
						handleClick={handleConfirm}
						icon={<SmallAddIcon />}
						px={{ base: "2em" }}
						type="submit"
					/>
				</HStack>
				{groupMembers?.length > 0 && (
					<Box w={"100%"} p={0} overflow={"auto"} fontWeight="normal">
						<UserList filteredEmployees={groupMembers} group={selectedGroup} />
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default GroupsPanel;
