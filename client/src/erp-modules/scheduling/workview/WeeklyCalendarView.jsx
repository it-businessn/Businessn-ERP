import { SmallAddIcon } from "@chakra-ui/icons";
import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Flex,
	HStack,
	IconButton,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useDisclosure,
} from "@chakra-ui/react";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";

import LeftIconButton from "components/ui/button/LeftIconButton";
import { addDays, format } from "date-fns";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import usePositionRoles from "hooks/usePositionRoles";
import moment from "moment";
import { useEffect, useState } from "react";
import { BsSendCheck } from "react-icons/bs";
import SchedulerService from "services/SchedulerService";
import ShiftModal from "./quick-selection/ShiftModal";

const WeeklyCalendarView = ({ weekStart, company, selectedCrew, timeFormat, employeesList }) => {
	// const locations = useWorkLocations(company, );
	const roles = usePositionRoles(company);
	const weekDays = [...Array(7)].map((_, i) => addDays(weekStart, i));

	const [shift, setShift] = useState(null);
	const [empName, setEmpName] = useState(null);
	const [empRole, setEmpRole] = useState(null);
	const [employeeShifts, setEmployeeShifts] = useState(null);
	const [newShiftAdded, setNewShiftAdded] = useState(null);
	const [showAddShiftModal, setShowAddShiftModal] = useState(false);
	const [dailyDataWithRunning, setDailyDataWithRunning] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const { isOpen, onOpen, onClose } = useDisclosure();
	const [openEmployee, setOpenEmployee] = useState(null);
	const [selectedDays, setSelectedDays] = useState(new Set());
	const [isSending, setIsSending] = useState(false);
	const [sentResult, setSentResult] = useState(null);

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
		if (selectedCrew) fetchShifts();
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
			saveDailyTotals();
		}
	}, [dailyDataWithRunning]);

	const dailyHours = dailyDataWithRunning?.map((d) => d.dayHours);
	const dailyWages = dailyDataWithRunning?.map((d) => d.dayWages);
	const runningTotals = dailyDataWithRunning?.map((d) => d.runningTotal);

	const getCrewLocation = () => (selectedCrew?.includes("Golf") ? "Golf course" : selectedCrew);
	// const minutesToHoursAndMinutes = (mins) => {
	// 	const hours = mins.toFixed(2);
	// 	const h = Math.floor(mins / 60);
	// 	const m = mins % 60;
	// 	console.log(hours);
	// 	return hours; //`${h}h ${m}m`;
	// };

	const handleItemClick = (emp, shiftTime, shiftDate) => {
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
			newShift.shiftStart = shiftStart;
			newShift.shiftEnd = shiftEnd;
		}
		if (shiftDate) {
			newShift.shiftDate = moment(shiftDate).toISOString();
		}
		if (newShift) setShift(newShift);
	};

	const convertTo12HourFormatRange = (timeRange) => {
		const [start, end] = timeRange.split("-");
		const startFormatted = moment(start, "HH:mm").format("hh:mm A");
		const endFormatted = moment(end, "HH:mm").format("hh:mm A");
		return `${startFormatted} - ${endFormatted}`;
	};

	async function sendSchedule() {
		if (!openEmployee) return;
		setIsSending(true);
		setSentResult(null);
		await new Promise((res) => setTimeout(res, 900));
		const payload = {
			employeeId: openEmployee.id,
			days: Array.from(selectedDays),
			sentAt: new Date().toISOString(),
			via: "email",
			type: "paystub",
		};
		setIsSending(false);
		setSentResult({ ok: true, payload });
	}

	function openSendModal(emp) {
		// const days = new Set(
		// weekdays.filter((d) => emp.shifts[d] && emp.shifts[d] !== "OFF")
		// );
		// setSelectedDays(days);
		// setSentResult(null);
		// setOpenEmployee(emp);
		// setTabIndex(0);
		onOpen();
	}
	return (
		<>
			<Box overflow="auto" h="calc(100vh - 200px)" css={tabScrollCss}>
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
						{(!employeeShifts || employeeShifts?.length === 0) && (
							<EmptyRowRecord
								data={employeeShifts}
								colSpan={weekDays?.length + 1}
								title="No shift found"
								description="Add shift to see them listed here"
							/>
						)}
						{employeeShifts?.map((emp) => (
							<Tr key={emp?.name}>
								<Td w="100px" px={1}>
									<Flex align="center">
										<NormalTextTitle whiteSpace="wrap" size="sm" width="100px" title={emp?.name} />
										<LeftIconButton
											color={"var(--nav_color)"}
											name={""}
											variant={"ghost"}
											isFilter
											size="xs"
											handleClick={() => openSendModal(emp)}
											icon={<BsSendCheck />}
										/>
									</Flex>
								</Td>
								{emp?.shifts?.map((entry, j) => {
									return (
										<Td w="200px" p={0} key={`${emp?.name}_${j}`} px={1}>
											<HStack
												bg={"var(--bg_color_1)"}
												// bgColor={shift.color}
												p={0}
												spacing={0}
												justify={"space-between"}
												w="200px"
												cursor={"pointer"}
												onClick={() => handleItemClick(emp, entry, weekDays[j])}
											>
												<Button
													isDisabled={j === 0 || j === 6}
													bg={entry?.shift === "Off" ? "var(--bg_color_1)" : "transparent"}
													p={0}
													color={
														entry?.shift === "Off" ? "var(--main_color_black)" : "var(--empName_bg)"
													}
													_hover={{
														color: "var(--main_color_black)",
														bg: entry
															? "transparent"
															: entry?.shift === "Off"
															? "var(--bg_color_1)"
															: "var(--empName_bg)",
													}}
													borderRadius={"10px"}
													whiteSpace="wrap"
												>
													{entry?.shift === "Off"
														? "Off"
														: `${
																timeFormat === "12"
																	? convertTo12HourFormatRange(entry?.shift)
																	: entry?.shift
														  } ${emp?.role} @ ${emp?.location}`}
												</Button>
												<IconButton
													color={
														entry?.shift === "Off" ? "var(--main_color_black)" : "var(--empName_bg)"
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
						))}

						<Tr
							fontWeight="bold"
							bg="gray.100"
							borderBottom={"1px solid black"}
							position="sticky"
							bottom="74px"
							zIndex="2"
						>
							<Td py={0} px={1}>
								Total Hours
							</Td>
							{dailyHours?.map((hours, dayIdx) => (
								<Td py={2} key={`hours_${dayIdx}`}>
									<TextTitle align="center" title={hours.toFixed(2)} />
								</Td>
							))}
						</Tr>
						<Tr fontWeight="bold" bg="gray.100" position="sticky" bottom="40px" zIndex="1">
							<Td py={0} px={1}>
								Total Wages
							</Td>
							{dailyWages?.map((wages, dayIdx) => (
								<Td py={2} key={`wages_${dayIdx}`}>
									<TextTitle align="center" title={wages.toFixed(2)} />
								</Td>
							))}
						</Tr>
						<Tr fontWeight="bold" bg="gray.100" position="sticky" bottom="0" zIndex="1">
							<Td py={0} px={1} whiteSpace={"wrap"}>
								Monthly Running Totals
							</Td>
							{runningTotals?.map((total, dayIdx) => (
								<Td py={2} key={`monthly_running_${dayIdx}`}>
									<TextTitle align="center" title={total.toFixed(2)} />
								</Td>
							))}
						</Tr>
					</Tbody>
				</Table>
			</Box>
			{isOpen && (
				<Modal
					isOpen={isOpen}
					onClose={() => {
						setOpenEmployee(null);
						onClose();
					}}
					size="lg"
				>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Send "Paystub"</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							{openEmployee && (
								<Box>
									<Flex align="center" gap={4} mb={4}>
										<Box>
											<Text fontWeight="medium">{openEmployee.name}</Text>
											<Text fontSize="sm" color="gray.500">
												{openEmployee.title}
											</Text>
										</Box>
									</Flex>

									{sentResult && (
										<Alert status="success" mt={4} rounded="md">
											<AlertIcon />
											Sent {sentResult.payload.type} —{" "}
											{new Date(sentResult.payload.sentAt).toLocaleString()}
										</Alert>
									)}
								</Box>
							)}
						</ModalBody>

						<ModalFooter>
							<Button mr={3} onClick={onClose} variant="ghost">
								Cancel
							</Button>
							<Button
								onClick={sendSchedule}
								isLoading={isSending}
								// isDisabled={tabIndex === 0 && selectedDays.size === 0}
								leftIcon={<BsSendCheck size={16} />}
							>
								Send
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			)}
			{showAddShiftModal && (
				<ShiftModal
					currentDate={moment().format("YYYY-MM-DD")}
					roles={roles}
					employees={employeesList}
					// locations={locations}
					location={getCrewLocation()}
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
