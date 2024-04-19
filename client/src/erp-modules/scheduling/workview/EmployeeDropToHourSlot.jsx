import { SmallAddIcon } from "@chakra-ui/icons";
import {
	Avatar,
	Box,
	Button,
	HStack,
	IconButton,
	Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDrop } from "react-dnd";

const EmployeeDropToHourSlot = ({
	hour,
	onDrop,
	employee,
	setResized,
	setColSpan,
	resized,
	colSpan,
}) => {
	const [{ isOver }, drop] = useDrop({
		accept: "employee",
		drop: (item) => onDrop(item, hour),
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	});
	const [isResizing, setIsResizing] = useState(false);
	const [shiftHour, setShiftHour] = useState(hour.split(":")[0]);
	const [shift, setShift] = useState(hour.split(":")[0]);
	const handleStartResize = (hour) => {
		setShiftHour(hour.split(":")[0]);
		setShift(hour.split(":")[1]);
		setIsResizing(true);
		setResized(true);
	};
	useEffect(() => {
		const handleResize = (e) => {
			if (isResizing) {
				console.log(e.movementX, shiftHour);
				const movementX = e.movementX;
				// setColSpan((prev) => prev + movementX);
			}
		};

		const handleEndResize = () => {
			setIsResizing(false);
		};

		document.addEventListener("mousemove", handleResize);
		document.addEventListener("touchmove", handleResize);
		document.addEventListener("mouseup", handleEndResize);
		document.addEventListener("touchend", handleEndResize);

		return () => {
			document.removeEventListener("mousemove", handleResize);
			document.removeEventListener("touchmove", handleResize);
			document.removeEventListener("mouseup", handleEndResize);
			document.removeEventListener("touchend", handleEndResize);
		};
	}, [isResizing]);

	return (
		<Box
			w={"100%"}
			ref={drop}
			border={isOver && "2px solid #ccc"}
			bgColor={isOver ? "green.100" : "transparent"}
		>
			<Text color={"#f9f9f9"} fontSize={"lg"} userSelect={"none"}>
				{hour}
			</Text>
			{employee?.shifts?.map(
				(shift) =>
					hour === shift?.start &&
					employee.name === shift?.name && (
						<HStack
							key={shift.start}
							bgColor={employee.color}
							borderRadius={"50px"}
							px={"1"}
							py={0}
							spacing={0}
							cursor={"pointer"}
							// onMouseDown={() => {
							// 	handleStartResize(shift.hour);
							// }}
						>
							<Avatar size={"xs"} name={shift.name} />
							<Button variant="ghost" size="xs" color={"var(--bg_color_1)"}>
								{`1 hour`}
							</Button>
							<IconButton
								size={"xs"}
								icon={<SmallAddIcon />}
								aria-label="Open Sidebar"
								_hover={{ bg: "transparent" }}
								// onClick={() => onOpen()}
							/>
						</HStack>
					),
			)}
		</Box>
	);
};

export default EmployeeDropToHourSlot;
