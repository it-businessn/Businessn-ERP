import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import { useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import { styleConsole } from "utils";
import AuxillaryPay from "./workview-tabs/AuxillaryPay";
import EmployeeDetails from "./workview-tabs/EmployeeDetails";
import HourlyAllocation from "./workview-tabs/HourlyAllocation";

const PaygroupDetailTable = () => {
	const company = LocalStorageService.getItem("selectedCompany");

	const TABS = [
		{
			id: 0,
			type: "Employee Details",
			name: <EmployeeDetails company={company} />,
		},
		{
			id: 1,
			type: "Hourly Allocation",
			name: <HourlyAllocation company={company} />,
		},
		{
			id: 2,
			type: "Auxillary Pay",
			name: <AuxillaryPay company={company} />,
		},
	];

	const [viewMode, setViewMode] = useState(TABS[0].type);

	const showComponent = (viewMode) => {
		styleConsole(viewMode);
		return TABS.find(({ type }) => type === viewMode)?.name;
	};

	return (
		<>
			<TabsButtonGroup
				tabs={TABS}
				setViewMode={setViewMode}
				viewMode={viewMode}
			/>
			{showComponent(viewMode)}
		</>
	);
};

export default PaygroupDetailTable;
