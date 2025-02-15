import { Grid, GridItem, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import Settings from "erp-modules/payroll/Settings";
import BaseModulePanel from "features/sign-up/BaseModulePanel";
import DepartmentsPanel from "features/sign-up/DepartmentsPanel";
import RolesPanel from "features/sign-up/RolesPanel";
import useCompany from "hooks/useCompany";
import useManager from "hooks/useManager";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import SettingService from "services/SettingService";
import CompaniesPanel from "../setup/company/CompaniesPanel";
import AddNewGroup from "../setup/company/group-tab/AddNewGroup";

const Configuration = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const managers = useManager(company);
	const [modules, setModules] = useState(null);

	const [openAddGroup, setOpenAddGroup] = useState(false);
	const [openAddModule, setOpenAddModule] = useState(false);
	const [openAddDepartment, setOpenAddDepartment] = useState(false);
	const [openAddRole, setOpenAddRole] = useState(false);
	const [openCompanyForm, setOpenCompanyForm] = useState(false);
	const [openHoliday, setOpenHoliday] = useState(false);

	const CONFIG_OPTIONS = [
		{
			name: ` ${openCompanyForm ? "Hide" : "Show"} Company Details`,
			handleClick: () => {
				setOpenCompanyForm(true);
				setOpenHoliday(false);
			},
			title: "Manage Companies",
		},
		{
			name: "Add Module",
			handleClick: () => setOpenAddModule(true),
			title: "Manage Modules",
		},
		{
			name: "Add Role",
			handleClick: () => setOpenAddRole(true),
			title: "Manage Role",
		},
		{
			name: "Add Paygroup",
			handleClick: () => setOpenAddGroup(true),
			title: "Manage Paygroup",
		},
		{
			name: "Add Department",
			handleClick: () => setOpenAddDepartment(true),
			title: "Manage Department",
		},
		{
			name: "Add Stat Holidays",
			handleClick: () => {
				setOpenHoliday(true);
				setOpenCompanyForm(false);
			},
			title: "Manage Stat Holidays",
		},
	];

	useEffect(() => {
		const fetchAllModules = async () => {
			try {
				const { data } = await SettingService.getAllModules(company);
				setModules(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllModules();
	}, []);

	return (
		<PageLayout width="full" title="Configuration" showBgLayer>
			<Grid templateColumns={{ base: "1fr", md: "repeat(6, 1fr)" }} gap={6}>
				{CONFIG_OPTIONS.map(({ title, handleClick, name }) => (
					<GridItem key={name}>
						<VStack spacing={4} p={5} boxShadow="md" borderRadius="lg" bg="gray.100">
							<TextTitle title={title} align="center" />
							<PrimaryButton size="xs" name={name} onOpen={handleClick} />
						</VStack>
					</GridItem>
				))}
			</Grid>
			{openCompanyForm && <CompaniesPanel setOpenCompanyForm={setOpenCompanyForm} />}
			{openAddGroup && (
				<AddNewGroup
					isOpen={openAddGroup}
					company={company}
					onClose={() => setOpenAddGroup(false)}
					modules={modules}
					managers={managers}
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
			{openHoliday && <Settings company={company} />}
		</PageLayout>
	);
};

export default Configuration;
