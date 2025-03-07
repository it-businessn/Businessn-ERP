import BoxCard from "components/ui/card";
import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import { useState } from "react";
import { isExtraPay } from "utils";
import AmountAllocation from "./amount/AmountAllocation";
// import EmployeeContribution fr om "./EmployeeContribution";
import EmployeeDetails from "./EmployeeDetails";
// import EmployerContribution from "./EmployerContribution";
import { HStack } from "@chakra-ui/react";
import PopupMessage from "components/ui/PopupMessage";
import TextTitle from "components/ui/text/TextTitle";
import EmployeeContribution from "./ee-contribution/EmployeeContribution";
import EmployerContribution from "./er-contribution/EmployerContribution";
import HourlyAllocation from "./hourly/HourlyAllocation";

const PaygroupDetailTable = ({
	closestRecord,
	payGroupSchedule,
	empPath,
	groupId,
	selectedPayGroup,
	company,
	loggedInUser,
}) => {
	const [highlightColor, setHighlightColor] = useState("var(--primary_button_bg)");
	const [isOpen, setIsOpen] = useState(true);
	const [payrunOption, setPayrunOption] = useState(1);

	const TABS = [
		{
			id: 0,
			type: "Employee Details",
			highlightColor,
			name: (
				<EmployeeDetails
					path={empPath}
					payGroupSchedule={payGroupSchedule}
					company={company}
					closestRecord={closestRecord}
					groupId={groupId}
					selectedPayGroup={selectedPayGroup}
					payrunOption={payrunOption}
				/>
			),
		},
		{
			id: 1,
			type: "Hourly Allocation",
			highlightColor,
			name: (
				<HourlyAllocation
					company={company}
					closestRecord={closestRecord}
					groupId={groupId}
					payrunOption={payrunOption}
				/>
			),
		},
		{
			id: 2,
			type: "Amount Allocation",
			highlightColor,
			name: (
				<AmountAllocation
					path={empPath}
					company={company}
					closestRecord={closestRecord}
					groupId={groupId}
					payrunOption={payrunOption}
				/>
			),
		},
		{
			id: 3,
			type: "EE Contribution",
			highlightColor,
			name: (
				<EmployeeContribution
					company={company}
					closestRecord={closestRecord}
					groupId={groupId}
					payrunOption={payrunOption}
				/>
			),
		},
		{
			id: 4,
			type: "ER Contribution",
			highlightColor,
			name: (
				<EmployerContribution
					company={company}
					closestRecord={closestRecord}
					groupId={groupId}
					payrunOption={payrunOption}
				/>
			),
		},
	];

	const [viewMode, setViewMode] = useState(TABS[0].type);

	const showComponent = (viewMode) => TABS.find(({ type }) => type === viewMode)?.name;

	const payNum = closestRecord
		? isExtraPay(closestRecord?.payPeriod, closestRecord?.isExtraRun)
		: "";

	const handleClick = () => setIsOpen(!isOpen);

	return (
		<BoxCard>
			<HStack w="30%" alignItems="center" justifyContent="start" mb="2px">
				<TextTitle mb={2} width="200px" title={`Pay Number: ${payNum}`} />
				<PopupMessage
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					handleClick={handleClick}
					loggedInUser={loggedInUser}
					setHighlightColor={setHighlightColor}
					payrunOption={payrunOption}
					setPayrunOption={setPayrunOption}
					highlightColor={highlightColor}
				/>
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
