import { Box, HStack, Tbody, Td, Tr, useToast, VStack } from "@chakra-ui/react";
import LeftIconButton from "components/ui/button/LeftIconButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { ROLES } from "constant";
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

const EmployeeTimeCard = ({ selectedUser, company, isMobile }) => {
	const cols = [
		"Worked Date",
		"Start Time",
		"End Time",
		// "Break/Lunch",
		"Total Hours",
	];
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
			},
		],
	};
	const loggedInUser = LocalStorageService.getItem("user");
	const deptName = loggedInUser?.role === ROLES.MANAGER ? loggedInUser?.department : null;
	const [time, setTime] = useState(new Date());
	const [showAddEntry, setShowAddEntry] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const [timesheetData, setTimesheetData] = useState([]);
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
		if (filter) fetchAllEmployeeTimesheet();
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
						<LeftIconButton
							size="3em"
							name={
								<VStack p={3}>
									<TextTitle size="2xl" title={formattedTime} />
									<TextTitle title={monthDayYear} />
								</VStack>
							}
							variant="outline"
							colorScheme="blue"
							w="full"
						/>
					)}
					<HStack justify="space-between" w="100%">
						{CLOCK_TYPES.row_1.map(({ name, onClick, bg, isClicked }) => (
							<LeftIconButton
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
						{CLOCK_TYPES.row_2.map(({ name, onClick, bg, isClicked }) => (
							<LeftIconButton
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
				</VStack>
			</BoxCard>
			<BoxCard p={{ base: "0.5em 1em", md: "1em" }}>
				<HStack justify={"space-between"}>
					<Box>
						<TextTitle size={"sm"} whiteSpace="wrap" title={`Time Entries `} />
						<TextTitle size={"sm"} whiteSpace="wrap" title={`${startDate} - ${endDate}`} />
					</Box>
					<PrimaryButton size={"xs"} name="Add ENTRY" onOpen={() => setShowAddEntry(true)} />
				</HStack>

				<TableLayout
					cols={cols}
					isSmall
					w="100%"
					position="sticky"
					zIndex={3}
					top={-1}
					textAlign="center"
					minH="15vh"
					height="15vh"
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
										: param_hours === "breakHoursWorked"
										? breakHoursWorked
										: 0;

								return (
									<Tr key={_id} _hover={{ bg: "var(--phoneCall_bg_light)" }}>
										<Td p={0.5}>
											<TextTitle
												size={isMobile ? "xs" : "sm"}
												title={clockIn && getTimeCardFormat(clockIn, notDevice, true)}
											/>
										</Td>

										<Td p={0.5}>
											<NormalTextTitle
												size="sm"
												title={clockIn ? getTimeFormat(clockIn, notDevice) : ""}
											/>
										</Td>
										<Td p={0.5}>
											<NormalTextTitle
												size="sm"
												title={clockOut ? getTimeFormat(clockOut, notDevice) : ""}
											/>
										</Td>

										<Td p={0.5}>
											<NormalTextTitle
												align={isMobile && "center"}
												size="sm"
												title={param_hours_worked}
											/>
										</Td>
									</Tr>
								);
							},
						)}
					</Tbody>
				</TableLayout>
				{showAddEntry && (
					<ExtraTimeEntryModal
						company={company}
						showAddEntry={showAddEntry}
						setRefresh={setRefresh}
						setShowAddEntry={setShowAddEntry}
						userId={selectedUser?._id}
						source={TIMESHEET_SOURCE.EMP}
						deptName={deptName}
					/>
				)}
			</BoxCard>
		</>
	);
};

export default EmployeeTimeCard;
