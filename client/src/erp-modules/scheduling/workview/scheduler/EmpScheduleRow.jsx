import { SmallAddIcon } from "@chakra-ui/icons";
import { Button, Flex, HStack, IconButton, Td, Tooltip, useDisclosure } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import { useState } from "react";

import { format } from "date-fns";
import moment from "moment";
import { BsSendCheck } from "react-icons/bs";
import { convertTo12HourFormatRange } from "utils/convertDate";
import { EmpWeekScheduleModal } from "../modal/EmpWeekScheduleModal";
import ShiftModal from "../modal/ShiftModal";

export const EmpScheduleRow = ({
	emp,
	employeesList,
	weekDays,
	timeFormat,
	weekStart,
	weekEnd,
	location,
	company,
	setNewShiftAdded,
	selectedCrew,
	weekTitle,
	setSentResult,
}) => {
	const [empName, setEmpName] = useState(null);
	const [empRole, setEmpRole] = useState(null);
	const [showAddShiftModal, setShowAddShiftModal] = useState(false);
	const [shift, setShift] = useState(null);
	const [empWeeklyShifts, setEmpWeeklyShifts] = useState(null);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const onShiftClicked = (emp, shiftTime, shiftDate) => {
		setShowAddShiftModal(true);
		let newShift = null;
		if (emp) {
			const { name, role, payRate, email } = emp;
			newShift = { empName: name, role, location: emp?.location, payRate: payRate || 0, email };
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
				const currentShift = shift?.shift;
				const noShift = currentShift === "Off";
				shift.color = noShift ? "var(--main_color_black)" : "var(--empName_bg)";
				shift.bg = noShift
					? emp.emailSent
						? "var(--phoneCall_bg_light)"
						: "var(--bg_color_1)"
					: "transparent";
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
								bg={shift.bg}
								p={0}
								color={shift.color}
								_hover={{
									color: "var(--main_color_black)",
									bg: shift ? "transparent" : noShift ? "var(--bg_color_1)" : "var(--empName_bg)",
								}}
								borderRadius={"10px"}
								whiteSpace="wrap"
							>
								{noShift
									? currentShift
									: `${
											timeFormat === "12" ? convertTo12HourFormatRange(shift?.shift) : shift?.shift
									  } ${emp?.role} @ ${emp?.location}`}
							</Button>
							<IconButton
								color={shift.color}
								size={"xs"}
								icon={<SmallAddIcon />}
								aria-label="Shift"
								_hover={{ bg: "transparent" }}
							/>
						</HStack>
					</Td>
				);
			})}

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
