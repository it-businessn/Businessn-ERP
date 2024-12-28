import BoxCard from "components/ui/card";
import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import { isExtraPay } from "utils";
import AmountAllocation from "./AmountAllocation";
// import EmployeeContribution fr om "./EmployeeContribution";
import EmployeeDetails from "./EmployeeDetails";
// import EmployerContribution from "./EmployerContribution";
import { HStack, Select } from "@chakra-ui/react";
import { PAYRUN_OPTIONS } from "constant";
import EmployeeContribution from "./EmployeeContribution";
import EmployerContribution from "./EmployerContribution";
import HourlyAllocation from "./HourlyAllocation";

const PaygroupDetailTable = ({
	closestRecord,
	payGroupSchedule,
	empPath,
	groupId,
	selectedPayGroup,
	company,
}) => {
	const [payrunOption, setPayrunOption] = useState(1);
	const [selectedHighlightColor, setHighlightColor] = useState(1);

	useEffect(() => {
		setHighlightColor(
			PAYRUN_OPTIONS.find(({ code }) => code === parseInt(payrunOption))?.highlightColor,
		);
	}, [payrunOption]);

	const TABS = [
		{
			id: 0,
			type: "Employee Details",
			highlightColor: selectedHighlightColor,
			name: (
				<EmployeeDetails
					path={empPath}
					payGroupSchedule={payGroupSchedule}
					company={company}
					closestRecord={closestRecord}
					groupId={groupId}
					selectedPayGroup={selectedPayGroup}
				/>
			),
		},
		{
			id: 1,
			type: "Hourly Allocation",
			highlightColor: selectedHighlightColor,
			name: <HourlyAllocation company={company} closestRecord={closestRecord} groupId={groupId} />,
		},
		{
			id: 2,
			type: "Amount Allocation",
			highlightColor: selectedHighlightColor,
			name: (
				<AmountAllocation
					path={empPath}
					company={company}
					closestRecord={closestRecord}
					groupId={groupId}
				/>
			),
		},
		{
			id: 3,
			type: "EE Contribution",
			highlightColor: selectedHighlightColor,
			name: (
				<EmployeeContribution company={company} closestRecord={closestRecord} groupId={groupId} />
			),
		},
		{
			id: 4,
			type: "ER Contribution",
			highlightColor: selectedHighlightColor,
			name: (
				<EmployerContribution company={company} closestRecord={closestRecord} groupId={groupId} />
			),
		},
	];

	const [viewMode, setViewMode] = useState(TABS[0].type);

	const showComponent = (viewMode) => TABS.find(({ type }) => type === viewMode)?.name;

	const handlePayrun = (e) => {
		setPayrunOption(e.target.value);
	};

	const payNum = closestRecord
		? isExtraPay(closestRecord?.payPeriod, closestRecord?.isExtraRun)
		: "";

	return (
		<BoxCard>
			<HStack alignItems="center" w="40%" justifyContent="start" mb="2px">
				<TextTitle flex={0.2} mb={2} title={`Pay Number: ${payNum}`} />
				<Select
					flex={0.7}
					size={"sm"}
					border="1px solid var(--primary_button_bg)"
					borderRadius="10px"
					value={payrunOption}
					placeholder="Select Payrun Option"
					onChange={handlePayrun}
				>
					{PAYRUN_OPTIONS?.map(({ name, code }) => (
						<option value={code} key={name}>
							{name}
						</option>
					))}
				</Select>
			</HStack>
			{company && (
				<>
					<TabsButtonGroup tabs={TABS} setViewMode={setViewMode} viewMode={viewMode} />
					{showComponent(viewMode)}
				</>
			)}
		</BoxCard>
	);
};

export default PaygroupDetailTable;
