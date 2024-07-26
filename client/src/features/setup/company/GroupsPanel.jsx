import { HStack } from "@chakra-ui/react";
import LeftIconButton from "components/ui/button/LeftIconButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import { useSignup } from "hooks/useSignup";
import { useState } from "react";
import { MdSettingsSuggest } from "react-icons/md";
import { isPaygroup } from "utils";
import AddNewGroup from "./group-tab/AddNewGroup";
import EditGroup from "./group-tab/EditGroup";
import FilterMenu from "./group-tab/FilterMenu";
import UserSection from "./group-tab/UserSection";

const GroupsPanel = ({
	employees,
	setFilteredEmployees,
	filteredEmployees,
	company,
}) => {
	const { modules, managers } = useSignup();
	const [selectedGroup, setSelectedGroup] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isRefresh, setIsRefresh] = useState(false);

	const [selectedModules, setSelectedModules] = useState(null);
	const [selectedAdmins, setSelectedAdmins] = useState(null);
	const [groupMembers, setGroupMembers] = useState(null);
	const [openAddGroup, setOpenAddGroup] = useState(false);
	const [showEditDetails, setShowEditDetails] = useState(false);

	return (
		<BoxCard fontWeight="bold" minH="50vh">
			<HStack>
				<PrimaryButton
					size="sm"
					name={"Add Group"}
					isLoading={isSubmitting}
					onOpen={() => setOpenAddGroup(true)}
				/>
				{isPaygroup(selectedGroup) && (
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
						startDate={selectedGroup?.scheduleSettings?.startDate}
						endDate={selectedGroup?.scheduleSettings?.endDate}
						processingDate={selectedGroup?.scheduleSettings?.processingDate}
						payDate={selectedGroup?.scheduleSettings?.payDate}
					/>
				)}
				{openAddGroup && (
					<AddNewGroup
						modules={modules}
						managers={managers}
						isOpen={openAddGroup}
						company={company}
						onClose={() => setOpenAddGroup(false)}
						setRefresh={setIsRefresh}
					/>
				)}
			</HStack>
			<FilterMenu
				company={company}
				isRefresh={isRefresh}
				managers={managers}
				modules={modules}
				selectedAdmins={selectedAdmins}
				selectedGroup={selectedGroup}
				selectedModules={selectedModules}
				setGroupMembers={setGroupMembers}
				setSelectedAdmins={setSelectedAdmins}
				setSelectedGroup={setSelectedGroup}
				setSelectedModules={setSelectedModules}
			/>
			<UserSection
				employees={employees}
				filteredEmployees={filteredEmployees}
				groupMembers={groupMembers}
				selectedAdmins={selectedAdmins}
				selectedGroup={selectedGroup}
				selectedModules={selectedModules}
				setFilteredEmployees={setFilteredEmployees}
				setIsRefresh={setIsRefresh}
				setIsSubmitting={setIsSubmitting}
			/>
		</BoxCard>
	);
};

export default GroupsPanel;
