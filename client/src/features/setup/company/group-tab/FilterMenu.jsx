import { FormControl, FormLabel, HStack, Select } from "@chakra-ui/react";
import Loader from "components/Loader";
import MultiSelectButton from "components/ui/form/MultiSelectButton";
import useGroup from "hooks/useGroup";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";

const FilterMenu = ({
	company,
	isRefresh,
	managers,
	modules,
	selectedAdmins,
	selectedGroup,
	selectedModules,
	setGroupMembers,
	setSelectedAdmins,
	setSelectedGroup,
	setSelectedModules,
}) => {
	const [openAdminMenu, setOpenAdminMenu] = useState(null);
	const groups = useGroup(company, isRefresh);

	useEffect(() => {
		if (!groups) {
			return;
		}
		setSelectedModules(groups[0].modules);
		setSelectedAdmins(groups[0].admin);
		setGroupMembers(groups[0].members);
	}, [groups]);

	const [openModuleMenu, setOpenModuleMenu] = useState(null);
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
		<>
			{(!modules || !groups || !managers) && <Loader autoHeight />}
			<HStack justifyContent={"start"} align={"self-start"}>
				{groups && (
					<FormControl>
						<FormLabel> Groups </FormLabel>
						<Select
							icon={<FaCaretDown />}
							borderRadius="10px"
							value={selectedGroup?.name ?? ""}
							placeholder="Select Group"
							onChange={handleGroup}
						>
							{groups?.map((group) => (
								<option value={group.name} key={group._id}>
									{group.name}
									{group?.payrollActivated && <>&#x1F7E2;</>}
								</option>
							))}
						</Select>
					</FormControl>
				)}
				{modules && (
					<FormControl>
						<FormLabel visibility={openModuleMenu ? "" : "hidden"}>Select Base Module</FormLabel>
						<MultiSelectButton
							handleMenuToggle={handleMenuToggle}
							assignees={selectedModules}
							data={modules}
							openAssigneeMenu={openModuleMenu}
							handleCloseMenu={handleCloseMenu}
							selectedOptions={selectedModules}
							setSelectedOptions={setSelectedModules}
							tag="modules(s)"
							label="Select Base Module"
						/>
					</FormControl>
				)}
				{managers && (
					<FormControl>
						<FormLabel visibility={openAdminMenu ? "" : "hidden"}>Group Admin</FormLabel>
						<MultiSelectButton
							handleMenuToggle={handleAdminMenuToggle}
							assignees={selectedAdmins}
							data={managers}
							openAssigneeMenu={openAdminMenu}
							handleCloseMenu={handleAdminCloseMenu}
							selectedOptions={selectedAdmins}
							setSelectedOptions={setSelectedAdmins}
							tag="modules(s)"
							label="Select Group Admin"
						/>
					</FormControl>
				)}
			</HStack>
		</>
	);
};

export default FilterMenu;
