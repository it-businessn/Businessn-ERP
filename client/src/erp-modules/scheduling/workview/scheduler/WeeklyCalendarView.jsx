import { SmallAddIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Flex,
	HStack,
	IconButton,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tooltip,
	Tr,
	useDisclosure,
} from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";

import { addDays, format } from "date-fns";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import moment from "moment";
import { useEffect, useState } from "react";
import { BsSendCheck } from "react-icons/bs";
import SchedulerService from "services/SchedulerService";
import { convertTo12HourFormatRange, CURRENT_YEAR } from "utils/convertDate";
import { EmpWeekScheduleModal } from "../modal/EmpWeekScheduleModal";
import ShiftModal from "../modal/ShiftModal";

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
	const [sentResult, setSentResult] = useState(false);
	const weekTitle = `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d")}, ${CURRENT_YEAR}`;

	const [shift, setShift] = useState(null);
	const [empName, setEmpName] = useState(null);
	const [empRole, setEmpRole] = useState(null);
	const [empWeeklyShifts, setEmpWeeklyShifts] = useState(null);
	const [employeeShifts, setEmployeeShifts] = useState(null);
	const [newShiftAdded, setNewShiftAdded] = useState(null);
	const [showAddShiftModal, setShowAddShiftModal] = useState(false);
	const [sentEmailUsers, setSentEmailUsers] = useState(null);
	const [dailyDataWithRunning, setDailyDataWithRunning] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const { isOpen, onOpen, onClose } = useDisclosure();

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

	// const minutesToHoursAndMinutes = (mins) => {
	// 	const hours = mins.toFixed(2);
	// 	const h = Math.floor(mins / 60);
	// 	const m = mins % 60;
	// 	console.log(hours);
	// 	return hours; //`${h}h ${m}m`;
	// };

	const onShiftClicked = (emp, shiftTime, shiftDate) => {
		setShowAddShiftModal(true);
		let newShift = null;
		if (emp) {
			const { name, role, payRate } = emp;
			newShift = { empName: name, role, location: emp?.location, payRate: payRate || 0 };
		}
		if (shiftTime) {
			newShift.notes = shiftTime?.notes;
			newShift._id = shiftTime?.shiftId;
			const [shiftStart, shiftEnd] = shiftTime?.shift.split("-");
			newShift.shiftStart = shiftStart?.trim();
			newShift.shiftEnd = shiftEnd?.trim();
		}
		if (shiftDate) {
			newShift.shiftDate = moment(shiftDate).toISOString();
		}
		if (newShift) setShift(newShift);
	};

	const openSendModal = (employeeShift) => {
		setEmpWeeklyShifts(employeeShift);
		onOpen();
	};

	return (
		<>
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
						{employeeShifts?.length === 0 && (
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
									<Td p={0} w="200px">
										<Flex px={3} alignItems="center" gap={2}>
											<NormalTextTitle whiteSpace="nowrap" size="sm" title={emp?.name} />

											<Tooltip label="Send week schedule">
												<span>
													<BsSendCheck cursor="pointer" onClick={() => openSendModal(emp)} />
												</span>
											</Tooltip>
										</Flex>
									</Td>
									{emp?.shifts?.map((shift, j) => {
										return (
											<Td w="200px" p={0} key={`shift_${emp?.name}_${j}`} px={1}>
												<HStack
													bg={emp.emailSent ? "var(--phoneCall_bg_light)" : "var(--bg_color_1)"}
													spacing={0}
													justify={"space-between"}
													w="200px"
													cursor={"pointer"}
													onClick={() => onShiftClicked(emp, shift, weekDays[j])}
												>
													<Button
														minH={"40px"}
														height={"auto"}
														isDisabled={j === 0 || j === 6}
														bg={
															shift?.shift === "Off"
																? emp.emailSent
																	? "var(--phoneCall_bg_light)"
																	: "var(--bg_color_1)"
																: "transparent"
														}
														p={0}
														color={
															shift?.shift === "Off"
																? "var(--main_color_black)"
																: "var(--empName_bg)"
														}
														_hover={{
															color: "var(--main_color_black)",
															bg: shift
																? "transparent"
																: shift?.shift === "Off"
																? "var(--bg_color_1)"
																: "var(--empName_bg)",
														}}
														borderRadius={"10px"}
														whiteSpace="wrap"
													>
														{shift?.shift === "Off"
															? "Off"
															: `${
																	timeFormat === "12"
																		? convertTo12HourFormatRange(shift?.shift)
																		: shift?.shift
															  } ${emp?.role} @ ${emp?.location}`}
													</Button>
													<IconButton
														color={
															shift?.shift === "Off"
																? "var(--main_color_black)"
																: "var(--empName_bg)"
														}
														size={"xs"}
														icon={<SmallAddIcon />}
														aria-label="Open Sidebar"
														_hover={{ bg: "transparent" }}
														isDisabled={j === 0 || j === 6}
													/>
												</HStack>
											</Td>
										);
									})}
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
			{isOpen && empWeeklyShifts && (
				<EmpWeekScheduleModal
					weekStart={format(weekStart, "MMM d")}
					weekEnd={format(weekEnd, "MMM d")}
					onClose={onClose}
					isOpen={isOpen}
					selectedDays={weekDays}
					empWeeklyShifts={empWeeklyShifts}
					location={location}
					company={company}
					weekTitle={weekTitle}
					setSentResult={setSentResult}
				/>
			)}
			{showAddShiftModal && (
				<ShiftModal
					currentDate={moment().format("YYYY-MM-DD")}
					employees={employeesList}
					// locations={locations}
					location={location}
					company={company}
					showModal={showAddShiftModal}
					setShowModal={setShowAddShiftModal}
					setNewShiftAdded={setNewShiftAdded}
					empName={empName}
					empRole={empRole}
					shift={shift}
					crew={selectedCrew}
				/>
			)}
		</>
	);
};
export default WeeklyCalendarView;
