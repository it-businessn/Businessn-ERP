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
import { useEffect, useState } from "react";
import TimesheetService from "services/TimesheetService";
import { getTimeCardFormat, getTimeFormat, monthDayYear } from "utils/convertDate";

const EmployeeTimeCard = ({ selectedUser, company }) => {
	const [time, setTime] = useState(new Date());
	const [showAddEntry, setShowAddEntry] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const [timesheetData, setTimesheetData] = useState([]);
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
		const fetchAllEmployeeTimesheet = async () => {
			setTimesheetData(null);
			try {
				const { data } = await TimesheetService.getTimesheetById(company, selectedUser?._id);
				setTimesheetData(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllEmployeeTimesheet();
	}, [refresh]);

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
			<PrimaryButton mt={3} name="Add Timesheet" onOpen={() => setShowAddEntry(true)} />
			<TableLayout
				cols={cols}
				isSmall
				w="100%"
				position="sticky"
				zIndex={3}
				top={-1}
				textAlign="center"
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
				/>
			)}
		</BoxCard>
	);
};

export default EmployeeTimeCard;
