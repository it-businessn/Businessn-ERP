import BoxCard from "components/ui/card";
import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import { isExtraPay } from "utils";
import AmountAllocation from "./AmountAllocation";
import EmployeeDetails from "./EmployeeDetails";
import HourlyAllocation from "./HourlyAllocation";

const PaygroupDetailTable = ({
	closestRecord,
	payGroupSchedule,
	empPath,
	groupId,
}) => {
	const company = LocalStorageService.getItem("selectedCompany");

	const TABS = [
		{
			id: 0,
			type: "Employee Details",
			name: (
				<EmployeeDetails
					path={empPath}
					payGroupSchedule={payGroupSchedule}
					company={company}
					closestRecord={closestRecord}
					groupId={groupId}
				/>
			),
		},
		{
			id: 1,
			type: "Hourly Allocation",
			name: (
				<HourlyAllocation
					company={company}
					closestRecord={closestRecord}
					groupId={groupId}
				/>
			),
		},
		{
			id: 2,
			type: "Amount Allocation",
			name: (
				<AmountAllocation
					company={company}
					closestRecord={closestRecord}
					groupId={groupId}
				/>
			),
		},
	];

	const [viewMode, setViewMode] = useState(TABS[0].type);

	const showComponent = (viewMode) =>
		TABS.find(({ type }) => type === viewMode)?.name;

	return (
		<BoxCard>
			<TextTitle
				mb={2}
				title={`Pay Number: ${isExtraPay(
					closestRecord?.payPeriod,
					closestRecord?.isExtraRun,
				)}`}
			/>
			{company && (
				<>
					<TabsButtonGroup
						tabs={TABS}
						setViewMode={setViewMode}
						viewMode={viewMode}
					/>
					{showComponent(viewMode)}
				</>
			)}
		</BoxCard>
	);
};

export default PaygroupDetailTable;
