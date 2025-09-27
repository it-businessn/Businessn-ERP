import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import Settings from "erp-modules/payroll/Settings";
import CompaniesPanel from "features/setup/company/CompaniesPanel";
import useGroup from "hooks/useGroup";
import useManager from "hooks/useManager";
import useModule from "hooks/useModule";
import useRoles from "hooks/useRoles";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import CCForm from "./CCForm";
import ModuleForm from "./ModuleForm";
import PaygroupForm from "./PaygroupForm";
import RoleForm from "./RoleForm";

const Configuration = () => {
	const company = LocalStorageService.getItem("selectedCompany");
	const [moduleAdded, setModuleAdded] = useState(false);
	const [paygroupAdded, setPaygroupAdded] = useState(false);
	const [systemAccessRoleAdded, setSystemAccessRoleAdded] = useState(false);
	const modules = useModule(company, moduleAdded);
	const managers = useManager(company);
	const paygroup = useGroup(company, paygroupAdded);
	const roles = useRoles(company, systemAccessRoleAdded);

	const SETUP_LIST = [
		{
			id: 0,
			type: "Manage Companies",
			name: <CompaniesPanel />,
		},
		{
			id: 1,
			type: "Setup Modules",
			name: (
				<ModuleForm companyName={company} modules={modules} setOptionDataRefresh={setModuleAdded} />
			),
		},
		{
			id: 2,
			type: "Setup System Access Level",
			name: (
				<RoleForm
					companyName={company}
					roles={roles}
					setOptionDataRefresh={setSystemAccessRoleAdded}
				/>
			),
		},
		{
			id: 3,
			type: "Setup Paygroup",
			name: (
				<PaygroupForm
					company={company}
					modules={modules}
					managers={managers}
					paygroup={paygroup}
					setRefresh={setPaygroupAdded}
				/>
			),
		},
		{
			id: 4,
			type: "Setup Cost Center / Department",
			name: <CCForm companyName={company} />,
		},
		{
			id: 5,
			type: "Setup Stat Holidays",
			name: <Settings company={company} />,
		},
	];

	const [viewMode, setViewMode] = useState(SETUP_LIST[0].type);
	const showComponent = (viewMode) => SETUP_LIST.find(({ type }) => type === viewMode)?.name;
	return (
		<PageLayout width="full" title={`Configuration for ${company}`} size="2em" showBgLayer>
			<TabsButtonGroup tabs={SETUP_LIST} setViewMode={setViewMode} viewMode={viewMode} />
			{showComponent(viewMode)}
		</PageLayout>
	);
};

export default Configuration;
