import { Avatar, Button, HStack } from "@chakra-ui/react";
import { useDrag } from "react-dnd";

const EmployeeDragToHourSlot = ({ employee, setHourDrop }) => {
	const [{ isDragging }, drag] = useDrag({
		type: "employeeSlot",
		item: () => {
			setHourDrop(true);
			return { id: employee };
		},
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	});
	return (
		<HStack
			p={0}
			spacing={0}
			cursor={"pointer"}
			ref={drag}
			opacity={isDragging ? 0.5 : 1}
		>
			<Avatar size={"xs"} name={employee} />
			<Button variant="ghost" size="sm">
				{employee}
			</Button>
		</HStack>
	);
};

export default EmployeeDragToHourSlot;
