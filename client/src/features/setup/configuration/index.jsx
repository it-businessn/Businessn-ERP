import { HStack } from "@chakra-ui/react";
import LinkButton from "components/ui/button/LinkButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BaseModulePanel from "features/sign-up/BaseModulePanel";
import DepartmentsPanel from "features/sign-up/DepartmentsPanel";
import RolesPanel from "features/sign-up/RolesPanel";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CompaniesPanel from "../company/CompaniesPanel";
import AddNewGroup from "../company/group-tab/AddNewGroup";

const ConfigurationPanel = ({ company }) => {
	const navigate = useNavigate();
	const [openAddGroup, setOpenAddGroup] = useState(false);
	const [openAddModule, setOpenAddModule] = useState(false);
	const [openAddDepartment, setOpenAddDepartment] = useState(false);
	const [openAddRole, setOpenAddRole] = useState(false);
	const goToSettings = () => navigate("/payroll/settings");
	return (
		<>
			<HStack>
				<PrimaryButton name="Add Module" onOpen={() => setOpenAddModule(true)} />
				<PrimaryButton name="Add Role" onOpen={() => setOpenAddRole(true)} />
				<PrimaryButton name="Add Paygroup" onOpen={() => setOpenAddGroup(true)} />
				<PrimaryButton name="Add Department" onOpen={() => setOpenAddDepartment(true)} />
				<LinkButton fontSize="sm" name="Set up Stat Holidays" onClick={goToSettings} />
			</HStack>
			<CompaniesPanel />
			{openAddGroup && (
				<AddNewGroup
					isOpen={openAddGroup}
					company={company}
					onClose={() => setOpenAddGroup(false)}
				/>
			)}
			{openAddModule && (
				<BaseModulePanel
					showAddModules={openAddModule}
					companyName={company}
					setShowAddModules={setOpenAddModule}
				/>
			)}
			{openAddRole && (
				<RolesPanel
					showAddRoles={openAddRole}
					companyName={company}
					setShowAddRoles={setOpenAddRole}
				/>
			)}
			{openAddDepartment && (
				<DepartmentsPanel
					showAddDepartments={openAddDepartment}
					setShowAddDepartments={setOpenAddDepartment}
					companyName={company}
				/>
			)}
		</>
	);
};

export default ConfigurationPanel;
