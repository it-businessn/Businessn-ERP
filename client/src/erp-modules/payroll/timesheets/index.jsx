import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import useTimesheet from "hooks/useTimesheet";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import { isManager } from "utils";
// import Timecard from "./Timecard";
// import Timesheet from "./Timesheet";
import { Td, Tr } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import React from "react";
import { getDateDiffHours, getDefaultTime } from "utils";
import Timecard from "./Timecard";
import Timesheet from "./Timesheet";

const Timesheets = () => {
	const loggedInUser = LocalStorageService.getItem("user");
	const isManagerView = isManager(loggedInUser?.role);
	const timesheets = useTimesheet(isManagerView, loggedInUser?._id);

	const TABS = [
		{
			id: 0,
			type: "Timesheet",
			name: (
				<Timesheet
					cols={[
						"Employees",
						"Status",
						"Department",
						"Pay Rate",
						"Pay Type",
						"Start Time",
						"End Time",
						"Break/Lunch",
						"Total Hours (HH:mm)",
					]}
					content={timesheets?.map(
						({
							_id,
							employeeId,
							approveStatus,
							payType,
							payRate,
							clockIns,
							clockOuts,
							startBreaks,
							endBreaks,
							projectEntries,
						}) => (
							<React.Fragment key={_id}>
								<Tr>
									<Td>
										<TextTitle title={employeeId?.fullName} weight="normal" />
									</Td>
									<Td>{approveStatus}</Td>
									<Td>{employeeId?.role}</Td>
									<Td>{payRate}</Td>
									<Td>{payType}</Td>
									<Td>
										{clockIns.length > 0 ? getDefaultTime(clockIns[0]) : ""}
									</Td>
									<Td>
										{clockOuts.length > 0
											? getDefaultTime(clockOuts[clockOuts.length - 1])
											: ""}
									</Td>
									<Td>
										{getDateDiffHours(
											startBreaks[startBreaks.length - 1],
											endBreaks[endBreaks.length - 1],
										)}
									</Td>
									<Td>
										{getDateDiffHours(
											clockIns[0],
											clockOuts[clockOuts.length - 1],
										)}
									</Td>
								</Tr>
							</React.Fragment>
						),
					)}
				/>
			),
		},
		{
			id: 1,
			type: "Timecards",
			name: (
				<Timecard
					cols={[
						"Employees",
						"Status",
						"Clock In",
						"Clock Out",
						"Start Break",
						"End Break",
						"Clock In",
						"Clock Out",
						"Total Hours (HH:mm)",
					]}
					content={timesheets?.map(
						(
							{
								_id,
								employeeId,
								approveStatus,
								payType,
								payRate,
								clockIns,
								clockOuts,
								startBreaks,
								endBreaks,
								projectEntries,
							},
							index,
						) => (
							<React.Fragment key={_id}>
								<Tr>
									<Td>
										<TextTitle title={employeeId?.fullName} weight="normal" />
									</Td>
									<Td>{approveStatus}</Td>
									<Td>
										{clockIns.length > 0 ? getDefaultTime(clockIns[0]) : ""}
									</Td>
									<Td>
										{clockOuts.length > 0 ? getDefaultTime(clockOuts[0]) : ""}
									</Td>
									<Td>
										{startBreaks.length > 0
											? getDefaultTime(startBreaks[startBreaks.length - 1])
											: ""}
									</Td>
									<Td>
										{endBreaks.length > 0
											? getDefaultTime(endBreaks[endBreaks.length - 1])
											: ""}
									</Td>
									<Td>
										{clockIns.length > 1
											? getDefaultTime(clockIns[clockIns.length - 1])
											: ""}
									</Td>
									<Td>
										{clockOuts.length > 1
											? getDefaultTime(clockIns[clockOuts.length - 1])
											: ""}
									</Td>
									<Td>
										{getDateDiffHours(
											clockIns[0],
											clockOuts[clockOuts.length - 1],
										)}
									</Td>
								</Tr>
							</React.Fragment>
						),
					)}
				/>
			),
		},
	];

	const [viewMode, setViewMode] = useState(TABS[0].type);

	const showComponent = (viewMode) =>
		TABS.find(({ type }) => type === viewMode)?.name;

	return (
		<PageLayout title={"Timesheets"}>
			<TabsButtonGroup
				isOutlineTab
				tabs={TABS}
				setViewMode={setViewMode}
				viewMode={viewMode}
			/>
			{showComponent(viewMode)}
		</PageLayout>
	);
};

export default Timesheets;
