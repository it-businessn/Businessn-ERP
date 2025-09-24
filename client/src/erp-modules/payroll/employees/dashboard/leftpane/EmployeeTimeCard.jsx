import { Box, HStack, Tbody, Td, Tr, useToast, VStack } from "@chakra-ui/react";
import LeftIconButton from "components/ui/button/LeftIconButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { ROLES } from "constant";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import { getParamKey, TIMESHEET_SOURCE } from "erp-modules/payroll/timesheets/data";
import ExtraTimeEntryModal from "erp-modules/payroll/timesheets/ExtraTimeEntryModal";
import usePaygroup from "hooks/usePaygroup";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import TimesheetService from "services/TimesheetService";
import {
	dayMonthYear,
	formatDateBar,
	getMomentDate,
	getTimeCardFormat,
	getTimeFormat,
	monthDayYear,
} from "utils/convertDate";
import AddLeave from "./AddLeave";

const EmployeeTimeCard = ({ selectedUser, company, isMobile }) => {
	const cols = [
		"Worked Date",
		"Start Time",
		"End Time",
		// "Break/Lunch",
		"Total Hours",
	];
	const leaveRequestCols = ["Type", "Start Date", "End Date", "Status", "Total Days"];
	const CLOCK_TYPES = {
		row_1: [
			{
				name: "Clock IN",
				bg: "var(--action_status_approve)",
				isClicked: false,
				onClick: () => updateSubmit("0", `Clock In successful!`),
			},
			{
				name: "Break START",
				isClicked: false,
				onClick: () => updateSubmit("3", `Break Started!`),
				isDisabled: true,
			},
		],
		row_2: [
			{
				name: "Clock OUT",
				bg: "var(--action_status_reject)",
				isClicked: false,
				onClick: () => updateSubmit("1", `Clock Out Successful!`),
			},
			{
				name: "Break END",
				bg: "var(--event_color)",
				isClicked: false,
				onClick: () => updateSubmit("2", `Break Ended!`),
				isDisabled: true,
			},
		],
	};
	const loggedInUser = LocalStorageService.getItem("user");
	const deptName = loggedInUser?.role === ROLES.MANAGER ? loggedInUser?.department : null;
	const [time, setTime] = useState(new Date());
	const [showAddEntry, setShowAddEntry] = useState(false);
	const [showLeaveForm, setShowLeaveForm] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const [timesheetData, setTimesheetData] = useState([]);
	const [leaveRequests, setLeaveRequests] = useState([]);
	const [filter, setFilter] = useState(null);
	const { closestRecord } = usePaygroup(company, false);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const toast = useToast();

	useEffect(() => {
		if (!closestRecord) {
			return;
		}
		const startDate = getMomentDate(closestRecord?.payPeriodStartDate);
		const endDate = getMomentDate(closestRecord?.payPeriodEndDate);
		setFilter({ startDate, endDate });

		const formattedStartDate = isMobile
			? formatDateBar(closestRecord?.payPeriodStartDate)
			: dayMonthYear(closestRecord?.payPeriodStartDate);
		const formattedEndDate = isMobile
			? formatDateBar(closestRecord?.payPeriodEndDate)
			: dayMonthYear(closestRecord?.payPeriodEndDate);
		setStartDate(formattedStartDate);
		setEndDate(formattedEndDate);
	}, [closestRecord]);

	useEffect(() => {
		const fetchAllEmployeeTimesheet = async () => {
			setTimesheetData(null);
			try {
				const { data } = await TimesheetService.getTimesheetById(
					company,
					selectedUser?._id,
					filter,
				);
				setTimesheetData(data);
			} catch (error) {
				console.error(error);
			}
		};
		const fetchEmployeeLeaveRequests = async () => {
			try {
				const { data } = await TimesheetService.getEmployeeLeaveRequest(company, selectedUser?._id);
				setLeaveRequests(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (filter) {
			fetchAllEmployeeTimesheet();
			fetchEmployeeLeaveRequests();
		}
	}, [refresh, filter]);

	useEffect(() => {
		const timer = setInterval(() => {
			setTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const formattedTime = time.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});

	const updateSubmit = async (punch, message) => {
		try {
			await TimesheetService.addTimesheetManual({
				punch,
				company,
				employeeId: selectedUser?._id,
				source: TIMESHEET_SOURCE.APP,
			});
			setRefresh((prev) => !prev);
			toast({
				title: message,
				status: "success",
				duration: 1500,
				isClosable: true,
			});
		} catch (error) {
			console.error(error);
			toast({
				title: "Please try again.",
				status: "error",
				duration: 1500,
				isClosable: true,
			});
		}
	};

	return (
		<>
			<BoxCard>
				<VStack w="100%" spacing={2}>
					{isMobile ? (
						<Box borderRadius="10px" py={1} w="100%" border="1px solid var(--primary_button_bg)">
							<TextTitle align={"center"} size={isMobile ? "lg" : "2xl"} title={formattedTime} />
							<TextTitle align={"center"} size={isMobile ? "sm" : "md"} title={monthDayYear} />
						</Box>
					) : (
						<VStack
							borderRadius="10px"
							p={2}
							spacing={0}
							w="full"
							border="1px solid var(--primary_button_bg)"
						>
							<TextTitle align={"center"} size="2xl" title={formattedTime} />
							<TextTitle align={"center"} title={monthDayYear} />
						</VStack>
					)}
					<HStack justify="space-between" w="100%">
						{CLOCK_TYPES.row_1.map(({ name, onClick, bg, isClicked, isDisabled }) => (
							<LeftIconButton
								isDisabled={isDisabled}
								key={name}
								isLoading={isClicked}
								size={{ base: "sm", md: "xl" }}
								name={name}
								variant="solid"
								w="50%"
								bg={bg}
								_hover={{ color: "var(--main_color)" }}
								handleClick={onClick}
							/>
						))}
					</HStack>
					<HStack justify="space-between" w="100%">
						{CLOCK_TYPES.row_2.map(({ name, onClick, bg, isClicked, isDisabled }) => (
							<LeftIconButton
								key={name}
								isDisabled={isDisabled}
								isLoading={isClicked}
								size={{ base: "sm", md: "xl" }}
								name={name}
								variant="solid"
								w="50%"
								bg={bg}
								_hover={{ color: "var(--main_color)" }}
								handleClick={onClick}
							/>
						))}
					</HStack>
					{isMobile && (
						<PrimaryButton
							w="100%"
							name="Request Leave"
							bg="var(--request_leave)"
							onOpen={() => setShowLeaveForm(true)}
							borderRadius="md"
						/>
					)}
				</VStack>
			</BoxCard>
			{showLeaveForm && (
				<AddLeave
					isOpen={showLeaveForm}
					handleClose={() => setShowLeaveForm(false)}
					company={company}
					userId={selectedUser?._id}
					source={TIMESHEET_SOURCE.EMPLOYEE}
					setRefresh={setRefresh}
				/>
			)}
			<HStack justifyContent="space-between" flexDirection={{ base: "column", md: "row" }}>
				<BoxCard p={{ base: "0.5em 1em", md: "1em" }} width="100%">
					<HStack justify={"space-between"}>
						<TextTitle size={"sm"} whiteSpace="wrap" title="Leave Requests" />
						{!isMobile && (
							<PrimaryButton
								bg="var(--request_leave)"
								size={"sm"}
								name="Request Leave"
								onOpen={() => setShowLeaveForm(true)}
							/>
						)}
					</HStack>
					<TableLayout
						cols={leaveRequestCols}
						isSmall
						w="100%"
						position="sticky"
						zIndex={3}
						top={-1}
						textAlign="center"
						minH={{ base: "auto", md: "15vh" }}
						height={{ base: "200px", md: "15vh" }}
						css={tabScrollCss}
					>
						<Tbody>
							{(!leaveRequests || leaveRequests?.length === 0) && (
								<EmptyRowRecord px={0} data={leaveRequests} colSpan={leaveRequestCols.length} />
							)}
							{leaveRequests?.map(
								({ type, startDate, endDate, status, totalLeaveHrs, totalLeaveDays, _id }) => (
									<Tr key={_id} _hover={{ bg: "var(--phoneCall_bg_light)" }}>
										<Td p={0.5}>
											<TextTitle whiteSpace="wrap" size={{ base: "xs", md: "sm" }} title={type} />
										</Td>
										<Td p={0.5}>
											<NormalTextTitle
												size={{ base: "xs", md: "sm" }}
												title={formatDateBar(startDate)}
											/>
										</Td>
										<Td p={0.5}>
											<NormalTextTitle
												size={{ base: "xs", md: "sm" }}
												title={formatDateBar(endDate)}
											/>
										</Td>
										<Td p={0.5}>
											<NormalTextTitle size={{ base: "xs", md: "sm" }} title={status} />
										</Td>
										<Td p={0.5}>
											<NormalTextTitle
												align="center"
												size={{ base: "xs", md: "sm" }}
												title={totalLeaveDays}
											/>
										</Td>
									</Tr>
								),
							)}
						</Tbody>
					</TableLayout>
				</BoxCard>
				<BoxCard p={{ base: "0.5em 1em", md: "1em" }} width="100%">
					<HStack justify={"space-between"} w="100%">
						<Box>
							<TextTitle size={"sm"} whiteSpace="wrap" title={`Time Entries `} />
							<TextTitle
								size={"sm"}
								whiteSpace="wrap"
								title={`${startDate || ""} - ${endDate || ""}`}
							/>
						</Box>
						<PrimaryButton
							bg="var(--banner_bg)"
							size={"sm"}
							name="Add ENTRY"
							onOpen={() => setShowAddEntry(true)}
						/>
					</HStack>
					{showAddEntry && (
						<ExtraTimeEntryModal
							company={company}
							showAddEntry={showAddEntry}
							setRefresh={setRefresh}
							setShowAddEntry={setShowAddEntry}
							userId={selectedUser?._id}
							source={TIMESHEET_SOURCE.EMPLOYEE}
							deptName={deptName}
						/>
					)}
					<TableLayout
						cols={cols}
						isSmall
						w="100%"
						position="sticky"
						zIndex={3}
						top={-1}
						textAlign="center"
						minH={{ base: "auto", md: "15vh" }}
						height={{ base: "200px", md: "15vh" }}
						css={tabScrollCss}
					>
						<Tbody>
							{(!timesheetData || timesheetData?.length === 0) && (
								<EmptyRowRecord px={0} data={timesheetData} colSpan={cols.length} />
							)}
							{timesheetData?.map(
								({
									_id,
									payType,
									regHoursWorked,
									breakHoursWorked,
									overtimeHoursWorked,
									dblOvertimeHoursWorked,
									statDayHoursWorked,
									statDayHours,
									sickPayHours,
									vacationPayHours,
									totalBreaks,
									clockIn,
									clockOut,
									totalBreakHours,
									totalWorkedHours,
									bereavementPayHours,
									personalPayHours,
									notDevice,
								}) => {
									const { param_hours } = getParamKey(payType);

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
											: param_hours === "vacationPayHours"
											? vacationPayHours
											: param_hours === "personalPayHours"
											? personalPayHours
											: param_hours === "bereavementPayHours"
											? bereavementPayHours
											: param_hours === "breakHoursWorked"
											? breakHoursWorked
											: 0;

									return (
										<Tr key={_id} _hover={{ bg: "var(--phoneCall_bg_light)" }}>
											<Td p={0.5}>
												<TextTitle
													size={{ base: "xs", md: "sm" }}
													title={clockIn && getTimeCardFormat(clockIn, notDevice, true)}
												/>
											</Td>

											<Td p={0.5}>
												<NormalTextTitle
													size={{ base: "xs", md: "sm" }}
													title={clockIn ? getTimeFormat(clockIn, notDevice) : ""}
												/>
											</Td>
											<Td p={0.5}>
												<NormalTextTitle
													size={{ base: "xs", md: "sm" }}
													title={clockOut ? getTimeFormat(clockOut, notDevice) : ""}
												/>
											</Td>

											<Td p={0.5}>
												<NormalTextTitle
													align={isMobile && "center"}
													size={{ base: "xs", md: "sm" }}
													title={param_hours_worked}
												/>
											</Td>
										</Tr>
									);
								},
							)}
						</Tbody>
					</TableLayout>
				</BoxCard>
			</HStack>
		</>
	);
};

export default EmployeeTimeCard;
