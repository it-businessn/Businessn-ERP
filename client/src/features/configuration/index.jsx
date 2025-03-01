import { Flex, Grid, GridItem, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import Settings from "erp-modules/payroll/Settings";
import useCompany from "hooks/useCompany";
import useDepartment from "hooks/useDepartment";
import useGroup from "hooks/useGroup";
import useManager from "hooks/useManager";
import useRoles from "hooks/useRoles";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import SettingService from "services/SettingService";
import CompaniesPanel from "../setup/company/CompaniesPanel";
import DeptForm from "./DeptForm";
import ModuleForm from "./ModuleForm";
import PaygroupForm from "./PaygroupForm";
import RoleForm from "./RoleForm";

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

	const roles = useRoles(company);
	const dept = useDepartment(company);
	const paygroup = useGroup(company);

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

	const CONFIG_OPTIONS = [
		{
			name: ` ${openCompanyForm ? "Hide" : "Show"} Company Details`,
			handleClick: () => {
				setOpenCompanyForm(true);
				setOpenAddModule(false);
				setOpenAddRole(false);
				setOpenAddGroup(false);
				setOpenAddDepartment(false);
				setOpenHoliday(false);
			},
			title: "Manage Companies",
		},
		{
			name: "Add Module",
			handleClick: () => {
				setOpenCompanyForm(false);
				setOpenAddModule(true);
				setOpenAddRole(false);
				setOpenAddGroup(false);
				setOpenAddDepartment(false);
				setOpenHoliday(false);
			},
			title: "Manage Modules",
		},
		{
			name: "Add Role",
			handleClick: () => {
				setOpenCompanyForm(false);
				setOpenAddModule(false);
				setOpenAddRole(true);
				setOpenAddGroup(false);
				setOpenAddDepartment(false);
				setOpenHoliday(false);
			},
			title: "Manage Role",
		},
		{
			name: "Add Paygroup",
			handleClick: () => {
				setOpenCompanyForm(false);
				setOpenAddModule(false);
				setOpenAddRole(false);
				setOpenAddGroup(true);
				setOpenAddDepartment(false);
				setOpenHoliday(false);
			},
			title: "Manage Paygroup",
		},
		{
			name: "Add Department",
			handleClick: () => {
				setOpenCompanyForm(false);
				setOpenAddModule(false);
				setOpenAddRole(false);
				setOpenAddGroup(false);
				setOpenAddDepartment(true);
				setOpenHoliday(false);
			},
			title: "Manage Department",
		},
		{
			name: "Add Stat Holidays",
			handleClick: () => {
				setOpenCompanyForm(false);
				setOpenAddModule(false);
				setOpenAddRole(false);
				setOpenAddGroup(false);
				setOpenAddDepartment(false);
				setOpenHoliday(true);
			},
			title: "Manage Stat Holidays",
		},
	];

	return (
		<PageLayout width="full" title={`Configuration for ${company}`} size="2em" showBgLayer>
			<Grid templateColumns={{ base: "1fr", md: "repeat(6, 1fr)" }} gap={6}>
				{CONFIG_OPTIONS.map(({ title, handleClick, name }) => (
					<GridItem key={name}>
						<VStack spacing={4} p={5} boxShadow="md" borderRadius="lg" bg="var(--logo_bg)">
							<TextTitle color="var(--primary_bg)" title={title} align="center" />
							<PrimaryButton
								hover={{
									color: "var(--primary_bg)",
									bg: "var(--primary_button_bg)",
								}}
								size="xs"
								name={name}
								onOpen={handleClick}
							/>
						</VStack>
					</GridItem>
				))}
			</Grid>
			<Flex m={"2em 10em"} p={"2em"} gap={"2em"} borderRadius="10px" justifyContent="space-evenly">
				{openCompanyForm && <CompaniesPanel setOpenCompanyForm={setOpenCompanyForm} />}
				{openAddGroup && (
					<PaygroupForm
						company={company}
						modules={modules}
						managers={managers}
						showList={true}
						paygroup={paygroup}
					/>
				)}
				{openAddModule && <ModuleForm companyName={company} showList={true} modules={modules} />}
				{openAddRole && <RoleForm companyName={company} showList={true} roles={roles} />}
				{openAddDepartment && <DeptForm companyName={company} showList={true} dept={dept} />}
				{openHoliday && <Settings company={company} />}
			</Flex>
		</PageLayout>
	);
};

export default Configuration;
