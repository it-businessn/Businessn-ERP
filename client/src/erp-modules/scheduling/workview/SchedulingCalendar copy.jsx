import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import EmployeeDropToHourSlot from "./EmployeeDropToHourSlot";

const SchedulingCalendar = () => {
	const hours = [
		"8:00 AM",
		"9:00 AM",
		"10:00 AM",
		"11:00 AM",
		"12:00 PM",
		"1:00 PM",
		"2:00 PM",
		"3:00 PM",
		"4:00 PM",
		"5:00 PM",
		"6:00 PM",
		"7:00 PM",
	];
	const [shifts, setShifts] = useState([]);
	const [employees, setEmployees] = useState([]);
	const [updatedEmployees, setUpdatedEmployees] = useState([]);
	const [hourDrop, setHourDrop] = useState(false);

	const [resized, setResized] = useState(false);
	const [colSpan, setColSpan] = useState(1);
	const [shiftHour, setShiftHour] = useState("");
	const [shift, setShift] = useState("");
	const [movement, setMovement] = useState("");
	useEffect(() => {
		updatedEmployees.forEach(
			(emp) => (emp.shifts = shifts.filter((shift) => shift.name === emp.name)),
		);
		setEmployees(updatedEmployees);
	}, [updatedEmployees]);
	// const updatedShiftss = [...shifts];
	// useEffect(() => {
	// 	console.log(updatedShiftss);
	// 	setShifts(updatedShiftss);
	// }, []);
	// useEffect(() => {
	// 	if (movement < 0) {
	// 		let k = shifts.find((item) => item.name === shift.name);
	// 		if (k) {
	// 			const newstart = parseInt(k.start.split(":")[0]);
	// 			const newtime = k.start.split(":")[1];
	// 			const newend = newstart + movement;
	// 			updatedShiftss.push({
	// 				start: `${newstart}:${newtime}`,
	// 				end: `${newend}:${newtime}`,
	// 				name: shift.name,
	// 				color: shift.color,
	// 			});
	// 			setShifts(updatedShiftss);
	// 		}
	// 	} else {
	// 		let l = shifts.find((item) => item.name === shift.name);
	// 		if (l) {
	// 			const newstart = parseInt(l.start.split(":")[0]);
	// 			const newtime = l.start.split(":")[1];
	// 			const newend = newstart + movement;
	// 			updatedShiftss.push({
	// 				start: `${newstart}:${newtime}`,
	// 				end: `${newend}:${newtime}`,
	// 				name: shift.name,
	// 				color: shift.color,
	// 			});
	// 			setShifts(updatedShiftss);
	// 		}
	// 	}
	// }, [shift, movement]);

	const handleHourDrop = (employee, hour) => {
		const start = parseInt(hour.split(":")[0]);
		const time = hour.split(":")[1];
		const end = start + 1;
		const updatedEmployees = [...employees];
		const { id, name, color } = employee;

		const existingEmpIndex = updatedEmployees.findIndex(
			(emp) => emp.name === name,
		);
		if (existingEmpIndex === -1) {
			setUpdatedEmployees([
				...updatedEmployees,
				{
					id,
					name,
					color,
				},
			]);
		} else {
			setUpdatedEmployees([...updatedEmployees]);
		}

		const updatedShifts = [...shifts];
		updatedShifts.push({
			start: `${start}:${time}`,
			end: `${end}:${time}`,
			name,
			color,
		});
		setShifts(updatedShifts);
	};
	return (
		<Box overflow={"auto"} w={"100%"}>
			<Table>
				<Thead fontSize={"xs"}>
					<Th>Area 1</Th>
					{hours.map((hour) => (
						<Th>{hour}</Th>
					))}
				</Thead>
				<Tbody>
					<Tr>
						<Td>
							<Text fontWeight={"normal"}>Assign slot</Text>
						</Td>
						{hours.map((hour) => (
							<Td key={hour}>
								<EmployeeDropToHourSlot
									shifts={shifts}
									onDrop={handleHourDrop}
									hour={hour}
									employee={""}
									hourDrop={hourDrop}
									setHourDrop={setHourDrop}
								/>
							</Td>
						))}
					</Tr>
					{employees?.map((employee) => (
						<Tr>
							<Td>
								<Text>{employee.name}</Text>
							</Td>
							{
								// resized ? (
								// 	<Td>
								// 		<EmployeeDropToHourSlot
								// 			onDrop={handleHourDrop}
								// 			resized={resized}
								// 			colSpan={colSpan}
								// 			setResized={setResized}
								// 			employee={employee}
								// 			setColSpan={setColSpan}
								// 		/>
								// 	</Td>
								// ) : (
								hours.map((hour) => (
									<Td key={hour}>
										<EmployeeDropToHourSlot
											onDrop={handleHourDrop}
											hour={hour}
											colSpan={colSpan}
											employee={employee}
											resized={resized}
											setResized={setResized}
											setShiftHour={setShiftHour}
											setShift={setShift}
											shift={shift}
											setMovement={setMovement}
										/>
									</Td>
								))
							}
						</Tr>
					))}
				</Tbody>
			</Table>
		</Box>
	);
};

export default SchedulingCalendar;
