import { Flex, Grid, GridItem, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import Settings from "erp-modules/payroll/Settings";
import useCompany from "hooks/useCompany";
import useCostCenter from "hooks/useCostCenter";
import useDepartment from "hooks/useDepartment";
import useGroup from "hooks/useGroup";
import useManager from "hooks/useManager";
import useModule from "hooks/useModule";
import useRoles from "hooks/useRoles";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import CompaniesPanel from "../setup/company/CompaniesPanel";
import CCForm from "./CCForm";
import DeptForm from "./DeptForm";
import ModuleForm from "./ModuleForm";
import PaygroupForm from "./PaygroupForm";
import RoleForm from "./RoleForm";

const Configuration = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const managers = useManager(company);

	const [openAddGroup, setOpenAddGroup] = useState(false);
	const modules = useModule(company, openAddGroup);
	const [openAddModule, setOpenAddModule] = useState(false);
	const [openAddDepartment, setOpenAddDepartment] = useState(false);
	const [openAddRole, setOpenAddRole] = useState(false);
	const [openCompanyForm, setOpenCompanyForm] = useState(false);
	const [openCCForm, setOpenCCForm] = useState(false);
	const [openHoliday, setOpenHoliday] = useState(false);
	const [activeTabId, setActiveTabId] = useState("");

	const roles = useRoles(company, openAddRole);
	const dept = useDepartment(company, openAddDepartment);
	const cc = useCostCenter(company, openCCForm);
	const paygroup = useGroup(company, openAddGroup);

	const CONFIG_OPTIONS = [
		{
			name: ` ${openCompanyForm ? "Hide" : "Show"} Company Details`,
			handleClick: () => {
				setActiveTabId(1);
				setOpenCompanyForm(true);
				setOpenCCForm(false);
				setOpenAddModule(false);
				setOpenAddRole(false);
				setOpenAddGroup(false);
				setOpenAddDepartment(false);
				setOpenHoliday(false);
			},
			title: "Manage Companies",
			id: 1,
		},
		{
			name: "Add Module",
			handleClick: () => {
				setActiveTabId(2);
				setOpenCompanyForm(false);
				setOpenCCForm(false);
				setOpenAddModule(true);
				setOpenAddRole(false);
				setOpenAddGroup(false);
				setOpenAddDepartment(false);
				setOpenHoliday(false);
			},
			title: "Manage Modules",
			id: 2,
		},
		{
			name: "Add System Access Level",
			handleClick: () => {
				setActiveTabId(3);
				setOpenCompanyForm(false);
				setOpenCCForm(false);
				setOpenAddModule(false);
				setOpenAddRole(true);
				setOpenAddGroup(false);
				setOpenAddDepartment(false);
				setOpenHoliday(false);
			},
			title: "Manage System Access Level",
			id: 3,
		},
		{
			name: "Add Paygroup",
			handleClick: () => {
				setActiveTabId(4);
				setOpenCompanyForm(false);
				setOpenCCForm(false);
				setOpenAddModule(false);
				setOpenAddRole(false);
				setOpenAddGroup(true);
				setOpenAddDepartment(false);
				setOpenHoliday(false);
			},
			title: "Manage Paygroup",
			id: 4,
		},
		{
			name: "Add Cost Center",
			handleClick: () => {
				setActiveTabId(5);
				setOpenCompanyForm(false);
				setOpenCCForm(true);
				setOpenAddModule(false);
				setOpenAddRole(false);
				setOpenAddGroup(false);
				setOpenAddDepartment(false);
				setOpenHoliday(false);
			},
			title: "Manage Cost Center",
			id: 5,
		},
		{
			name: "Add Department",
			handleClick: () => {
				setActiveTabId(6);
				setOpenCompanyForm(false);
				setOpenCCForm(false);
				setOpenAddModule(false);
				setOpenAddRole(false);
				setOpenAddGroup(false);
				setOpenAddDepartment(true);
				setOpenHoliday(false);
			},
			title: "Manage Department",
			id: 6,
		},
		{
			name: "Add Stat Holidays",
			handleClick: () => {
				setActiveTabId(7);
				setOpenCompanyForm(false);
				setOpenCCForm(false);
				setOpenAddModule(false);
				setOpenAddRole(false);
				setOpenAddGroup(false);
				setOpenAddDepartment(false);
				setOpenHoliday(true);
			},
			title: "Manage Stat Holidays",
			id: 7,
		},
	];

	return (
		<PageLayout width="full" title={`Configuration for ${company}`} size="2em" showBgLayer>
			<Grid templateColumns={{ base: "1fr", md: "repeat(6, 1fr)" }} gap={6}>
				{CONFIG_OPTIONS.map(({ id, title, handleClick, name }) => (
					<GridItem key={name}>
						<VStack
							spacing={4}
							p={5}
							boxShadow="md"
							borderRadius="lg"
							bg={activeTabId === id ? "var(--banner_bg)" : "var(--logo_bg)"}
						>
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
			<Flex
				p={"3em"}
				gap={"3em"}
				borderRadius="10px"
				justifyContent="center"
				flexDir={openCompanyForm ? "column" : "row"}
			>
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
				{openCCForm && (
					<CCForm
						companyName={company}
						showList={true}
						cc={cc}
						handleClose={() => setOpenCCForm(false)}
					/>
				)}
				{openAddDepartment && <DeptForm companyName={company} showList={true} dept={dept} />}
				{openHoliday && <Settings company={company} />}
			</Flex>
		</PageLayout>
	);
};

export default Configuration;
