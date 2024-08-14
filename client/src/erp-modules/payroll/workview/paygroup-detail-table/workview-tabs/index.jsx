import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import { useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import { styleConsole } from "utils";
import AmountAllocation from "./AmountAllocation";
import EmployeeDetails from "./EmployeeDetails";
import HourlyAllocation from "./HourlyAllocation";

const PaygroupDetailTable = ({ closestRecord }) => {
	const company = LocalStorageService.getItem("selectedCompany");

	const TABS = [
		{
			id: 0,
			type: "Employee Details",
			name: <EmployeeDetails company={company} closestRecord={closestRecord} />,
		},
		{
			id: 1,
			type: "Hourly Allocation",
			name: (
				<HourlyAllocation company={company} closestRecord={closestRecord} />
			),
		},
		{
			id: 2,
			type: "Amount Allocation",
			name: (
				<AmountAllocation company={company} closestRecord={closestRecord} />
			),
		},
	];

	const [viewMode, setViewMode] = useState(TABS[0].type);

	const showComponent = (viewMode) => {
		styleConsole(viewMode);
		return TABS.find(({ type }) => type === viewMode)?.name;
	};

	return (
		company && (
			<>
				<TabsButtonGroup
					tabs={TABS}
					setViewMode={setViewMode}
					viewMode={viewMode}
				/>
				{showComponent(viewMode)}
			</>
		)
	);
};

export default PaygroupDetailTable;
