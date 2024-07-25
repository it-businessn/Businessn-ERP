import { SmallAddIcon } from "@chakra-ui/icons";
import {
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
import BoxCard from "components/ui/card";
import MultiSelectBox from "components/ui/form/select/MultiSelectBox";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { MdSettingsSuggest } from "react-icons/md";
import SettingService from "services/SettingService";
import UserService from "services/UserService";
import { isPaygroup } from "utils";
import AddNewGroup from "../AddNewGroup";
import EmpSearchMenu from "../EmpSearchMenu";
import UserList from "../UserList";
import EditGroup from "./EditGroup";

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
	const [showEditDetails, setShowEditDetails] = useState(false);
	const [deleteRecord, setDeleteRecord] = useState(false);
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);

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
				// setIsRefresh((prev) => !prev);
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
	const handleDelete = async () => {
		selectedGroup.members = selectedGroup.members.filter(
			(_) => _._id !== deleteRecord,
		);
		try {
			await SettingService.updateGroup(selectedGroup, selectedGroup._id);
			setIsRefresh((prev) => !prev);
			setShowConfirmationPopUp((prev) => !prev);
		} catch (error) {
			console.log("An error occurred. Please try again.");
		}
	};

	const handleClose = () => {
		setShowConfirmationPopUp((prev) => !prev);
	};

	return (
		<BoxCard fontWeight="bold">
			<HStack>
				<PrimaryButton
					size="sm"
					name={"Add Group"}
					isLoading={isSubmitting}
					onOpen={() => setOpenAddGroup(true)}
				/>
				{isPaygroup(selectedGroup?.name) && (
					<LeftIconButton
						color={"var(--nav_color)"}
						border={"2px solid var(--filter_border_color)"}
						name={"Update"}
						borderRadius={"10px"}
						variant={"ghost"}
						isFilter
						size="sm"
						ml={2}
						handleClick={() => setShowEditDetails(true)}
						icon={<MdSettingsSuggest />}
					/>
				)}
				{showEditDetails && (
					<EditGroup
						selectedGroup={selectedGroup}
						isOpen={showEditDetails}
						company={company}
						onClose={() => setShowEditDetails(false)}
					/>
				)}
				{openAddGroup && (
					<AddNewGroup
						modules={modules}
						admins={admins}
						isOpen={openAddGroup}
						company={company}
						onClose={() => setOpenAddGroup(false)}
						setRefresh={setIsRefresh}
					/>
				)}
			</HStack>
			{(!modules || !groups || !admins) && <Loader autoHeight />}
			<HStack justifyContent={"start"} align={"self-start"}>
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
							bg={"var(--primary_bg)"}
							color={"var(--primary_button_bg)"}
							_hover={{
								bg: "var(--primary_bg)",
								color: "var(--primary_button_bg)",
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
							bg={"var(--primary_bg)"}
							color={"var(--primary_button_bg)"}
							_hover={{
								bg: "var(--primary_bg)",
								color: "var(--primary_button_bg)",
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
			<BoxCard>
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
					<UserList
						isGroup
						filteredEmployees={groupMembers}
						group={selectedGroup}
						setShowConfirmationPopUp={setShowConfirmationPopUp}
						setDeleteRecord={setDeleteRecord}
						height="40vh"
					/>
				)}
			</BoxCard>
			{showConfirmationPopUp && (
				<DeletePopUp
					headerTitle={"Remove User"}
					textTitle={"Are you sure you want to remove the user from the group?"}
					isOpen={showConfirmationPopUp}
					onClose={handleClose}
					onOpen={handleDelete}
				/>
			)}
		</BoxCard>
	);
};

export default GroupsPanel;
