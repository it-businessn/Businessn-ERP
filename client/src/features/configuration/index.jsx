import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import Settings from "erp-modules/payroll/settings/Settings";
import CompaniesPanel from "features/configuration/company";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import { isBusinessN } from "utils/common";
import CostCenterPanel from "./cost-center";
import ModulePanel from "./modules";
import PaygroupPanel from "./paygroup";
import RolePanel from "./system-access-level";

const Configuration = () => {
	const company = LocalStorageService.getItem("selectedCompany");

	let SETUP_LIST = [
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

	const [setupList, setSetupList] = useState(SETUP_LIST);

	useEffect(() => {
		if (isBusinessN(company)) {
			setSetupList((prev) => [
				{
					id: 0,
					type: "Manage Companies",
					name: <CompaniesPanel />,
				},
				{
					id: 1,
					type: "Setup Modules",
					name: <ModulePanel companyName={company} />,
				},
				{
					id: 2,
					type: "Setup System Access Level",
					name: <RolePanel companyName={company} />,
				},
				{
					id: 3,
					type: "Setup Paygroup",
					name: <PaygroupPanel company={company} />,
				},
				...prev,
			]);
		}
	}, []);

	useEffect(() => {
		setViewMode(setupList[0].type);
	}, [setupList]);

	const [viewMode, setViewMode] = useState(null);
	const showComponent = (viewMode) => setupList?.find(({ type }) => type === viewMode)?.name;

	return (
		viewMode && (
			<PageLayout width="full" title={`Configuration for ${company}`} size="2em" showBgLayer>
				<TabsButtonGroup tabs={setupList} setViewMode={setViewMode} viewMode={viewMode} />
				{showComponent(viewMode)}
			</PageLayout>
		)
	);
};

export default Configuration;
