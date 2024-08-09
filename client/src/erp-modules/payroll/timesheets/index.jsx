import { HStack, IconButton, Stack, Td, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import InputFormControl from "components/ui/form/InputFormControl";
import TabsButtonGroup from "components/ui/tab/TabsButtonGroup";
import TextTitle from "components/ui/text/TextTitle";
import useTimesheet from "hooks/useTimesheet";
import PageLayout from "layouts/PageLayout";
import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useParams } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import TimesheetService from "services/TimesheetService";
import {
	getDateDiffHours,
	getDefaultDate,
	getDefaultTime,
	isManager,
} from "utils";
import { getParamKey, getStatusStyle } from "./data";
import ExtraTimeEntryModal from "./ExtraTimeEntryModal";
import Timecard from "./Timecard";
import Timesheet from "./Timesheet";

const Timesheets = () => {
	const company = LocalStorageService.getItem("selectedCompany");
	const { id } = useParams();
	const loggedInUser = LocalStorageService.getItem("user");
	const userId = id ?? loggedInUser._id;
	const isManagerView = isManager(loggedInUser?.role);

	const [refresh, setRefresh] = useState(false);
	const timesheets = useTimesheet(
		company,
		isManagerView,
		loggedInUser._id,
		refresh,
	);

	const initialFormData = {
		startTime: "",
		endTime: "",
		totalBreaks: "",
		approve: undefined,
		company,
		recordId: null,
	};
	const [formData, setFormData] = useState(initialFormData);
	const [showAddEntry, setShowAddEntry] = useState(false);

	const handleSave = async () => {
		try {
			if (formData.recordId) {
				await TimesheetService.updateTimesheet(formData, formData.recordId);
				setRefresh((prev) => !prev);
			}
		} catch (error) {}
	};

	useEffect(() => {
		if (formData.approve !== undefined) {
			handleSave();
		}
	}, [formData]);

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
						"Total Worked Hours",
						"Action",
					]}
					content={timesheets?.map(
						({
							_id,
							employeeId,
							approveStatus,
							payType,
							clockIns,
							clockOuts,
							regPay,
							statWorkPay,
							dblOverTimePay,
							overTimePay,
							createdOn,
							regHoursWorked,
							overtimeHoursWorked,
							dblOvertimeHoursWorked,
							statDayHoursWorked,
							statDayHours,
							sickPayHours,
							vacationPayHours,
							statPay,
							sickPay,
							vacationPay,
							totalBreaks,
						}) => {
							const startTime = clockIns.length ? clockIns[0] : "";
							const endTime = clockOuts.length
								? clockOuts[clockOuts.length - 1]
								: "";

							const approveStatusBtnCss = getStatusStyle(approveStatus);

							const { param_key, param_hours } = getParamKey(payType);

							const param_pay_type =
								param_key === "regPay"
									? regPay
									: param_key === "overTimePay"
									? overTimePay
									: param_key === "dblOverTimePay"
									? dblOverTimePay
									: param_key === "statWorkPay"
									? statWorkPay
									: param_key === "statPay"
									? statPay
									: param_key === "sickPay"
									? sickPay
									: vacationPay;

							const param_hours_worked =
								param_hours === "regHoursWorked"
									? regHoursWorked
									: param_hours === "overtimeHoursWorked"
									? overtimeHoursWorked
									: param_hours === "dblOvertimeHoursWorked"
									? dblOvertimeHoursWorked
									: param_hours === "statDayHoursWorked"
									? statDayHoursWorked
									: param_hours === "statDayHours"
									? statDayHours
									: param_hours === "sickPayHours"
									? sickPayHours
									: vacationPayHours;
							const isStatPay = payType === "Statutory Pay";

							const hhMMFormattedTime = `${(param_hours_worked / 60).toFixed(
								0,
							)}:${param_hours_worked % 60}`;

							return (
								<Tr key={_id}>
									<Td py={0}>
										<TextTitle title={employeeId?.fullName} />
									</Td>
									<Td py={0}>
										<TextTitle title={getDefaultDate(createdOn)} />
									</Td>
									<Td py={0}>
										<PrimaryButton
											color={approveStatusBtnCss.color}
											bg={approveStatusBtnCss.bg}
											name={approveStatus}
											size="xs"
											px={0}
											hover={"transparent"}
										/>
									</Td>
									<Td py={0}>
										<TextTitle
											size={"xs"}
											weight="normal"
											title={employeeId?.department?.[0]}
										/>
									</Td>
									<Td py={0}>{param_pay_type}</Td>
									<Td py={0}>{payType}</Td>
									<Td px={0}>
										<DateTimeFormControl
											label={""}
											hideTimeLabel
											valueText2={startTime}
											name2="startTime"
											handleChange={(e) => {
												setFormData((prevData) => ({
													...prevData,
													startTime: e.target.value,
													endTime,
													totalBreaks,
													param_hours,
													recordId: _id,
												}));
											}}
											handleConfirm={handleSave}
											required
										/>
									</Td>
									<Td py={0}>
										<DateTimeFormControl
											label={""}
											hideTimeLabel
											valueText2={endTime}
											name2="endTime"
											handleChange={(e) => {
												setFormData((prevData) => ({
													...prevData,
													startTime,
													endTime: e.target.value,
													totalBreaks,
													param_hours,
													recordId: _id,
												}));
											}}
											handleConfirm={() => handleSave()}
											required
										/>
									</Td>
									<Td py={0}>
										<InputFormControl
											readOnly={isStatPay}
											label={""}
											name="totalBreaks"
											valueText={totalBreaks}
											handleChange={(e) => {
												setFormData((prevData) => ({
													...prevData,
													startTime,
													endTime,
													totalBreaks: e.target.value,
													param_hours,
													recordId: _id,
												}));
											}}
											handleConfirm={() => handleSave()}
										/>
									</Td>
									<Td py={0}>{hhMMFormattedTime}</Td>
									<Td py={0}>
										<HStack spacing={0}>
											<IconButton
												size={"xs"}
												icon={<FaCheck />}
												variant={"solid"}
												color={"var(--status_button_border)"}
												onClick={() => {
													setFormData((prevData) => ({
														...prevData,
														startTime,
														endTime,
														totalBreaks,
														param_hours,
														recordId: _id,
														approve: true,
													}));
												}}
											/>
											<IconButton
												size={"xs"}
												color={"var(--incorrect_ans)"}
												icon={<IoClose />}
												variant={"solid"}
												onClick={() => {
													setFormData((prevData) => ({
														...prevData,
														startTime,
														endTime,
														totalBreaks,
														param_hours,
														recordId: _id,
														approve: false,
													}));
												}}
											/>
										</HStack>
									</Td>
								</Tr>
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
