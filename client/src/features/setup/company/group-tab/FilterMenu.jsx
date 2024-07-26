import {
	Button,
	FormControl,
	FormLabel,
	HStack,
	Select,
	Text,
} from "@chakra-ui/react";
import Loader from "components/Loader";
import MultiSelectBox from "components/ui/form/select/MultiSelectBox";
import useGroup from "hooks/useGroup";
import { useState } from "react";
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
	const groups = useGroup(
		company,
		setSelectedModules,
		setSelectedAdmins,
		setGroupMembers,
		setSelectedGroup,
		isRefresh,
	);
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
							value={selectedGroup.name}
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
				{managers && (
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
									data={managers}
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
		</>
	);
};

export default FilterMenu;
