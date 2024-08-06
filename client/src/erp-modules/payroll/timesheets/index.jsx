import { Stack, Td, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import TextTitle from "components/ui/text/TextTitle";
import PageLayout from "layouts/PageLayout";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import { getDateDiffHours, getDefaultTime, isManager } from "utils";
import { TIMESHEET_DATA } from "./data";
import ExtraTimeEntry from "./ExtraTimeEntry";
import ExtraTimeEntryModal from "./ExtraTimeEntryModal";
import Timecard from "./Timecard";
import Timesheet from "./Timesheet";

const Timesheets = () => {
	const company = LocalStorageService.getItem("selectedCompany");
	const { id } = useParams();
	const loggedInUser = LocalStorageService.getItem("user");
	const userId = id ?? loggedInUser._id;
	const isManagerView = isManager(loggedInUser?.role);
	// const timesheets = useTimesheet(company, isManagerView, loggedInUser._id);
	const timesheets = TIMESHEET_DATA;

	const [refresh, setRefresh] = useState(false);
	const [showAddEntry, setShowAddEntry] = useState(false);

	const TABS = [
		{
			id: 0,
			type: "Timesheet",
			name: (
				<Timesheet
					cols={[
						"Employee Name",
						"Worked Date",
						"Status",
						"Department",
						"Pay Rate",
						"Pay Type",
						"Start Time",
						"End Time",
						"Break/Lunch",
						"Total Worked Hours (HH:mm)",
						"",
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
							regPay,
							sickPay,
							statPay,
							statWorkPay,
							dblOverTimePay,
							overTimePay,
							createdOn,
							regHoursWorked,
							overtimeHoursWorked,
							statDayHoursWorked,
							dblOvertimeHoursWorked,
						}) => {
							const totalBreaks = getDateDiffHours(
								startBreaks[startBreaks.length - 1],
								endBreaks[endBreaks.length - 1],
							);

							const endTime =
								clockOuts.length > 0
									? getDefaultTime(clockOuts[clockOuts.length - 1])
									: "";
							const startTime =
								clockIns.length > 0 ? getDefaultTime(clockIns[0]) : "";
							const totalHours = getDateDiffHours(
								clockIns[0],
								clockOuts[clockOuts.length - 1],
							);
							return (
								<React.Fragment key={_id}>
									<ExtraTimeEntry
										createdOn={createdOn}
										name={employeeId?.fullName}
										approveStatus={approveStatus}
										dept={"dept"}
										param_key={regPay}
										type={"Regular Pay"}
										startTime={startTime}
										endTime={endTime}
										totalBreaks={totalBreaks}
										totalHours={regHoursWorked}
									/>
									{/* {showAdd && (
										<AddTimesheet
											isOpen={showAdd}
											onClose={() => setShowAdd(false)}
											setRefresh={setRefresh}
										/>
									)} */}
									{overTimePay && (
										<ExtraTimeEntry
											name={employeeId?.fullName}
											approveStatus={approveStatus}
											dept={"dept"}
											param_key={overTimePay}
											type={"Overtime Pay"}
											startTime={startTime}
											endTime={endTime}
											totalBreaks={totalBreaks}
											totalHours={overtimeHoursWorked}
										/>
									)}
									{dblOverTimePay && (
										<ExtraTimeEntry
											name={employeeId?.fullName}
											approveStatus={approveStatus}
											dept={"dept"}
											param_key={dblOverTimePay}
											type={"Double Overtime Pay"}
											startTime={startTime}
											endTime={endTime}
											totalBreaks={totalBreaks}
											totalHours={dblOvertimeHoursWorked}
										/>
									)}
									{statWorkPay && (
										<ExtraTimeEntry
											name={employeeId?.fullName}
											approveStatus={approveStatus}
											dept={"dept"}
											param_key={statWorkPay}
											type={"Statutory Worked Pay"}
											startTime={startTime}
											endTime={endTime}
											totalBreaks={totalBreaks}
											totalHours={statDayHoursWorked}
										/>
									)}
									{statPay && (
										<ExtraTimeEntry
											name={employeeId?.fullName}
											approveStatus={approveStatus}
											dept={"dept"}
											param_key={statPay}
											type={"Statutory Pay"}
											startTime={startTime}
											endTime={endTime}
											totalBreaks={totalBreaks}
											totalHours={0}
										/>
									)}
									{sickPay && (
										<ExtraTimeEntry
											name={employeeId?.fullName}
											approveStatus={approveStatus}
											dept={"dept"}
											param_key={sickPay}
											type={"Sick Pay"}
											startTime={startTime}
											endTime={endTime}
											totalBreaks={totalBreaks}
											totalHours={0}
										/>
									)}
								</React.Fragment>
							);
						},
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
										<TextTitle title={employeeId?.fullName} />
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
		<PageLayout
			title={"Timesheets"}
			showDate
			valueText1={new Date()}
			handleChange={(v) => console.log(v)}
		>
			<Stack spacing={0} align={"end"} mt={-10}>
				<PrimaryButton
					size={"sm"}
					name={"Add request"}
					onOpen={() => setShowAddEntry(true)}
				/>
				{showAddEntry && (
					<ExtraTimeEntryModal
						company={company}
						showAddEntry={showAddEntry}
						setRefresh={setRefresh}
						setShowAddEntry={setShowAddEntry}
					/>
				)}
			</Stack>
			<TabsButtonGroup
				mt={4}
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
