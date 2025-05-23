import { SmallAddIcon } from "@chakra-ui/icons";
import { Box, HStack, IconButton, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";

import { addDays, format } from "date-fns";
import moment from "moment";
import { useEffect, useState } from "react";
import SchedulerService from "services/SchedulerService";

const WeeklyCalendarView = ({
	weekStart,
	company,
	selectedCrew,
	newShiftAdded,
	setShowAddShiftModal,
	setShift,
}) => {
	const weekDays = [...Array(7)].map((_, i) => addDays(weekStart, i));
	const [employeeShifts, setEmployeeShifts] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

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
			const { name, role } = emp;
			newShift = { empName: name, role, location: emp?.location };
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
	return (
		<Box overflow="auto" h="calc(100vh - 205px)">
			<Table variant="simple">
				<Thead>
					<Tr>
						<Th py={2}>
							<TextTitle title="CUSTOM" />
						</Th>
						{weekDays.map((day, i) => (
							<Th py={2} key={`day_${i}`}>
								{format(day, "EEE dd")}
							</Th>
						))}
					</Tr>
				</Thead>
				<Tbody>
					{employeeShifts?.map((emp) => (
						<Tr key={emp?.name}>
							<Td w="100px" px={1}>
								<NormalTextTitle whiteSpace="wrap" size="sm" width="100px" title={emp?.name} />
							</Td>
							{emp?.shifts?.map((entry, j) => (
								<Td w="200px" py={1} key={`${emp?.name}_${j}`} px={1}>
									<HStack
										bg={"var(--bg_color_1)"}
										// bgColor={shift.color}
										p={0}
										spacing={0}
										justify={"space-between"}
										w="200px"
									>
										<PrimaryButton
											whiteSpace="wrap"
											hover={{
												color: "var(--main_color_black)",
												bg: entry
													? "transparent"
													: entry?.shift === "Off"
													? "var(--bg_color_1)"
													: "var(--empName_bg)",
											}}
											color={
												entry?.shift === "Off" ? "var(--main_color_black)" : "var(--empName_bg)"
											}
											bg={entry?.shift === "Off" ? "var(--bg_color_1)" : "transparent"}
											name={
												entry?.shift === "Off"
													? "Off"
													: `${entry?.shift} ${emp?.role} @ ${emp?.location}`
											}
										/>
										<IconButton
											color={
												entry?.shift === "Off" ? "var(--main_color_black)" : "var(--empName_bg)"
											}
											size={"xs"}
											icon={<SmallAddIcon />}
											aria-label="Open Sidebar"
											_hover={{ bg: "transparent" }}
											onClick={() => {
												handleItemClick(emp, entry, weekDays[j]);
											}}
										/>
									</HStack>
								</Td>
							))}
						</Tr>
					))}
					<Tr fontWeight="bold" bg="gray.100" position="sticky" bottom="0" zIndex="1">
						<Td py={0} px={1}>
							Total Hours
						</Td>
						{weekDays.map((_, dayIdx) => {
							const total =
								employeeShifts?.reduce((sum, emp) => {
									if (!emp.shifts || !emp.shifts[0]) return sum;
									return sum + calculateHours(emp.shifts[dayIdx]);
								}, 0) ?? 0;

							return (
								<Td py={2} key={dayIdx}>
									<TextTitle align="center" title={total.toFixed(2)} />
								</Td>
							);
						})}
					</Tr>
					{/*<Tr fontWeight="bold" bg="gray.100">
									<Td py={0}>Total Wages</Td>
									{weekDays.map((_, dayIdx) => {
										const total =
											employeeShifts?.reduce((sum, emp) => {
												if (!emp.shifts || !emp.shifts[0]) return sum;
												return sum + calculateHours(emp.shifts[dayIdx]);
											}, 0) ?? 0;

										return (
											<Td py={2} key={dayIdx}>
												{total}
											</Td>
										);
									})}
								</Tr> */}
				</Tbody>
			</Table>
		</Box>
	);
};
export default WeeklyCalendarView;
