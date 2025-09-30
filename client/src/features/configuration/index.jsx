import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import Settings from "erp-modules/payroll/settings/Settings";
import CompaniesPanel from "features/configuration/company";
import useManager from "hooks/useManager";
import useModule from "hooks/useModule";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import CostCenterPanel from "./cost-center";
import ModulePanel from "./modules";
import PaygroupPanel from "./paygroup";
import RolePanel from "./system-access-level";

const Configuration = () => {
	const company = LocalStorageService.getItem("selectedCompany");
	const [refresh, setRefresh] = useState(false);
	const modules = useModule(company, refresh);
	const managers = useManager(company);

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
				<ModulePanel companyName={company} modules={modules} setOptionDataRefresh={setRefresh} />
			),
		},
		{
			id: 2,
			type: "Setup System Access Level",
			name: <RolePanel companyName={company} />,
		},
		{
			id: 3,
			type: "Setup Paygroup",
			name: <PaygroupPanel company={company} modules={modules} managers={managers} />,
		},
		{
			id: 4,
			type: "Setup Cost Center / Department",
			name: <CostCenterPanel companyName={company} />,
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
