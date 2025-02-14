import { HStack, Tbody, Td, Tr, VStack, useToast } from "@chakra-ui/react";
import LeftIconButton from "components/ui/button/LeftIconButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { getParamKey } from "erp-modules/payroll/timesheets/data";
import ExtraTimeEntryModal from "erp-modules/payroll/timesheets/ExtraTimeEntryModal";
import usePaygroup from "hooks/usePaygroup";
import { useEffect, useState } from "react";
import TimesheetService from "services/TimesheetService";
import {
	dayMonthYear,
	getMomentDate,
	getTimeCardFormat,
	getTimeFormat,
	monthDayYear,
} from "utils/convertDate";

const EmployeeTimeCard = ({ selectedUser, company, isMobile }) => {
	const [time, setTime] = useState(new Date());
	const [showAddEntry, setShowAddEntry] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const [timesheetData, setTimesheetData] = useState([]);
	const [filter, setFilter] = useState(null);
	const { closestRecord } = usePaygroup(company, false);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

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
				bg: "var(--correct_ans)",
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
				bg: "var(--incorrect_ans)",
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

	const toast = useToast();

	useEffect(() => {
		if (!closestRecord) {
			return;
		}
		const startDate = getMomentDate(closestRecord?.payPeriodStartDate);
		const endDate = getMomentDate(closestRecord?.payPeriodEndDate);
		setFilter({ startDate, endDate });

		const formattedStartDate = dayMonthYear(closestRecord?.payPeriodStartDate);
		const formattedEndDate = dayMonthYear(closestRecord?.payPeriodEndDate);
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
			<BoxCard gap="1em">
				<VStack w="100%" spacing={3}>
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
					<HStack justify="space-between" w="100%">
						{CLOCK_TYPES.row_1.map(({ name, onClick, bg, isClicked }) => (
							<LeftIconButton
								key={name}
								isLoading={isClicked}
								size="xl"
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
								size="xl"
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
			<BoxCard>
				{isMobile ? (
					<VStack spacing={1}>
						<TextTitle title="Time Entries:" />
						<TextTitle whiteSpace="wrap" title={`${startDate} - ${endDate}`} />
						<PrimaryButton mt={3} name="Add ENTRY" onOpen={() => setShowAddEntry(true)} />
					</VStack>
				) : (
					<HStack>
						<TextTitle title={`Time Entries from ${startDate} to ${endDate}`} />
						<PrimaryButton mt={3} name="Add ENTRY" onOpen={() => setShowAddEntry(true)} />
					</HStack>
				)}

				<TableLayout
					cols={cols}
					isSmall
					w="100%"
					position="sticky"
					zIndex={3}
					top={-1}
					textAlign="center"
					height="15vh"
				>
					<Tbody>
						{(!timesheetData || timesheetData?.length === 0) && (
							<EmptyRowRecord data={timesheetData} colSpan={cols.length} />
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
											<TextTitle title={clockIn && getTimeCardFormat(clockIn, notDevice, true)} />
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
											<NormalTextTitle size="sm" title={param_hours_worked} />
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
					/>
				)}
			</BoxCard>
		</>
	);
};

export default EmployeeTimeCard;
