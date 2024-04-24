import { Avatar, Button, HStack, Icon } from "@chakra-ui/react";
import { useDrag } from "react-dnd";
import { RxDragHandleDots2 } from "react-icons/rx";
import { TaskButton } from "utils";

const EmployeeDragFromQuickSelection = ({
	employee,
	index,
	isExpanded,
	setIsExpandedIndex,
	setIsExpanded,
	color,
}) => {
	const [{ isDragging }, drag] = useDrag({
		type: "employee",
		item: { id: employee.id, name: employee.fullName, color },
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	});

	return (
		<HStack w={"100%"}>
			<TaskButton
				isExpanded={isExpanded}
				totalTasks={employee?.tasks?.length}
				onClick={() => {
					setIsExpandedIndex(index);
					setIsExpanded((prev) => !prev);
				}}
			/>
			<HStack
				w={"90%"}
				bgColor={color}
				borderRadius={"50px"}
				px={"1"}
				py={0}
				spacing={0}
				opacity={isDragging ? 0.5 : 1}
				ref={drag}
				cursor={"pointer"}
			>
				<Avatar size={"xs"} name={employee?.fullName} />
				<Button variant="ghost" size="xs" color={"var(--bg_color_1)"}>
					{employee?.fullName}
				</Button>
			</HStack>

			<Icon as={RxDragHandleDots2} boxSize={5} />
		</HStack>
	);
};

export default EmployeeDragFromQuickSelection;
