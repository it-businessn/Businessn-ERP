import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";

import { addDays, format } from "date-fns";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import { useEffect, useState } from "react";
import SchedulerService from "services/SchedulerService";
import { CURRENT_YEAR } from "utils/convertDate";
import { EmpScheduleRow } from "./EmpScheduleRow";

const WeeklyCalendarView = ({
	weekStart,
	company,
	selectedCrew,
	timeFormat,
	employeesList,
	location,
	weekEnd,
}) => {
	// const locations = useWorkLocations(company, );
	const weekDays = [...Array(7)].map((_, i) => addDays(weekStart, i));

	const [employeeShifts, setEmployeeShifts] = useState(null);
	const [newShiftAdded, setNewShiftAdded] = useState(null);
	const [dailyDataWithRunning, setDailyDataWithRunning] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [sentResult, setSentResult] = useState(false);
	const [sentEmailUsers, setSentEmailUsers] = useState(null);
	const weekTitle = `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d")}, ${CURRENT_YEAR}`;

	useEffect(() => {
		const fetchEmailLogs = async () => {
			try {
				const { data } = await SchedulerService.getScheduleEmailLogs(company, weekTitle);
				setSentEmailUsers(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (weekTitle) fetchEmailLogs();
	}, [weekTitle, sentResult]);

	useEffect(() => {
		const fetchShifts = async () => {
			setIsLoading(true);
			try {
				const { data } = await SchedulerService.getWorkWeekEmpShifts(
					weekStart,
					company,
					selectedCrew,
				);
				setEmployeeShifts(data);
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(true);
			}
		};
		if (selectedCrew || newShiftAdded) fetchShifts();
	}, [newShiftAdded, weekStart, selectedCrew]);

	useEffect(() => {
		let currentMonth = null;
		let monthlySum = 0;
		if (employeeShifts) {
			const calculateHours = (data) => {
				const { shift } = data;
				if (shift === "Off") return 0;
				const [start, end] = shift.split("-");
				const [startH, startM] = start.split(":").map(Number);
				const [endH, endM] = end.split(":").map(Number);
				const startMinutes = startH * 60 + startM;
				const endMinutes = endH * 60 + endM;
				return (endMinutes - startMinutes) / 60;
			};
			const dailyData = weekDays?.map((day, dayIdx) => {
				let totalHours = 0;
				let totalWages = 0;

				employeeShifts?.forEach((emp) => {
					const shift = emp.shifts?.[dayIdx];
					if (!shift) return;

					const hoursWorked = calculateHours(shift) || 0;
					totalHours += hoursWorked;
					totalWages += hoursWorked * (parseFloat(emp.payRate) || 0);
				});
				const dayDate = day?.date || day;
				const dayMonth = dayDate.getMonth();
				if (currentMonth !== dayMonth) {
					currentMonth = dayMonth;
					monthlySum = totalWages;
				} else {
					monthlySum += totalWages;
				}
				return {
					date: dayDate,
					dayHours: totalHours,
					dayWages: totalWages,
					runningTotal: monthlySum,
				};
			});

			setDailyDataWithRunning(dailyData);
		}
	}, [employeeShifts]);

	useEffect(() => {
		if (dailyDataWithRunning) {
			const saveDailyTotals = async () => {
				try {
					await SchedulerService.updateDailyTotals({ selectedCrew, dailyDataWithRunning, company });
				} catch (error) {}
			};
			if (dailyDataWithRunning?.find((_) => _.dayHours > 0)) saveDailyTotals();
		}
	}, [dailyDataWithRunning]);

	const totalsRow = [
		{ label: "Total Hours", value: dailyDataWithRunning?.map((d) => d.dayHours), key: "hours" },
		{ label: "Total Wages", value: dailyDataWithRunning?.map((d) => d.dayWages), key: "wages" },
		{
			label: "Monthly Running Totals",
			value: dailyDataWithRunning?.map((d) => d.runningTotal),
			key: "monthly_running",
		},
	];

	const filterEmpFromCurrentSchedule = (name) => {
		setEmployeeShifts(employeeShifts.filter((emp) => emp?.name !== name));
	};

	// const minutesToHoursAndMinutes = (mins) => {
	// 	const hours = mins.toFixed(2);
	// 	const h = Math.floor(mins / 60);
	// 	const m = mins % 60;
	// 	console.log(hours);
	// 	return hours; //`${h}h ${m}m`;
	// };

	return (
		<Box overflow="auto" h="calc(100vh - 170px)" css={tabScrollCss}>
			<Table variant="simple">
				<Thead position="sticky" top={-1} zIndex="2">
					<Tr>
						<Th py={2}>
							<TextTitle size={"sm"} title="Employee" />
						</Th>
						{weekDays.map((day, i) => (
							<Th py={2} key={`day_${i}`}>
								<NormalTextTitle size={"sm"} title={format(day, "EEE dd")} />
							</Th>
						))}
					</Tr>
				</Thead>
				<Tbody>
					{(!isLoading || employeeShifts?.length === 0) && (
						<EmptyRowRecord
							data={employeeShifts}
							colSpan={weekDays?.length + 1}
							title="No shift found"
							description="Add shift to see them listed here"
						/>
					)}
					{employeeShifts?.map((emp) => {
						emp.emailSent = sentEmailUsers?.find(({ employeeName }) => employeeName === emp.name);
						return (
							<Tr
								key={emp?.name}
								bg={emp.emailSent ? "var(--phoneCall_bg_light)" : "var(--bg_color_1)"}
							>
								<EmpScheduleRow
									emp={emp}
									filterEmpFromCurrentSchedule={filterEmpFromCurrentSchedule}
									employeesList={employeesList}
									weekDays={weekDays}
									timeFormat={timeFormat}
									weekStart={weekStart}
									weekEnd={weekEnd}
									location={location}
									company={company}
									setNewShiftAdded={setNewShiftAdded}
									selectedCrew={selectedCrew}
									sentEmailUsers={sentEmailUsers}
									weekTitle={weekTitle}
									setSentResult={setSentResult}
								/>
							</Tr>
						);
					})}
					{employeeShifts?.length > 0 &&
						totalsRow?.map((totalRow, i) => (
							<Tr
								key={totalRow.label}
								fontWeight="bold"
								bg="gray.100"
								position="sticky"
								bottom={`${(totalsRow.length - 1 - i) * 32}px`}
								zIndex="1"
							>
								<Td py={0} px={1}>
									{totalRow.label}
								</Td>
								{totalRow?.value?.map((record, dayIdx) => (
									<Td w="200px" py={2} key={`${totalRow.key}_${dayIdx}`}>
										<TextTitle align="center" title={record.toFixed(2)} />
									</Td>
								))}
							</Tr>
						))}
				</Tbody>
			</Table>
		</Box>
	);
};
export default WeeklyCalendarView;
