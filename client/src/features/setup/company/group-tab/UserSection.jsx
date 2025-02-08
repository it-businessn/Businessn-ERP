import { SmallAddIcon } from "@chakra-ui/icons";
import { HStack, Spacer } from "@chakra-ui/react";
import LeftIconButton from "components/ui/button/LeftIconButton";
import BoxCard from "components/ui/card";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import TextTitle from "components/ui/text/TextTitle";
import UserList from "features/setup/users/UserList";
import { useState } from "react";
import SettingService from "services/SettingService";
import EmpSearchMenu from "./EmpSearchMenu";

const UserSection = ({
	employees,
	filteredEmployees,
	groupMembers,
	selectedAdmins,
	selectedGroup,
	selectedModules,
	setFilteredEmployees,
	setIsRefresh,
	setIsSubmitting,
}) => {
	const [empName, setEmpName] = useState(null);
	const [deleteRecord, setDeleteRecord] = useState(false);
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);
	const handleClose = () => {
		setShowConfirmationPopUp((prev) => !prev);
	};
	const handleDelete = async () => {
		selectedGroup.members = selectedGroup.members.filter((_) => _._id !== deleteRecord);
		try {
			await SettingService.updateGroup(selectedGroup, selectedGroup._id);
			setIsRefresh((prev) => !prev);
			setShowConfirmationPopUp((prev) => !prev);
		} catch (error) {
			console.log("An error occurred. Please try again.");
		}
	};
	const handleConfirm = async (e) => {
		e.preventDefault();
		if (!selectedGroup) {
			return;
		}
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

	const handleSelect = (emp) => {
		setEmpName(emp.fullName);
		setFilteredEmployees(employees.filter((item) => item?.email === emp.email));
	};

	const handleInputChange = (value) => {
		setEmpName(value);
		setFilteredEmployees(
			employees.filter((emp) => emp?.fullName?.toLowerCase().includes(value.toLowerCase())),
		);
	};

	return (
		<>
			<BoxCard>
				<HStack justify={"space-between"}>
					<TextTitle title={`${groupMembers?.length || 0} User(s)` ?? ""} />

					<Spacer />
					<EmpSearchMenu
						filteredEmployees={filteredEmployees}
						empName={empName ?? ""}
						handleInputChange={handleInputChange}
						handleSelect={handleSelect}
					/>
					<LeftIconButton
						name="Add User"
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
		</>
	);
};

export default UserSection;
