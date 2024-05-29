import { SmallAddIcon } from "@chakra-ui/icons";
import { Avatar, Box, Button, HStack, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import AddTask from "./AddTask";

const ItemsRow = ({
	getItemProps,
	item,
	itemContext,
	getResizeProps,
	setRefresh,
}) => {
	const durationText = item.duration < 2 ? "hour" : "hours";

	const [showAddTask, setShowAddTask] = useState(false);
	const [assignee, setAssignee] = useState("");
	const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
	return (
		<>
			<Box {...getItemProps(item.itemProps)} w={"auto"}>
				{itemContext.useResizeHandle ? (
					<Box w={"auto"} {...leftResizeProps} />
				) : (
					""
				)}
				<HStack
					maxHeight={"23px"}
					bgColor={item.color}
					borderRadius={"50px"}
					px={"1"}
					py={0}
					spacing={0}
					justify={"space-between"}
				>
					<Avatar size={"xs"} name={itemContext.title} />
					<Button variant="ghost" size="xs" color={"var(--bg_color_1)"}>
						{`${item.duration} ${durationText}`}
					</Button>
					<IconButton
						size={"xs"}
						icon={<SmallAddIcon />}
						aria-label="Open Sidebar"
						_hover={{ bg: "transparent" }}
						onClick={() => {
							setAssignee(itemContext.title);
							setShowAddTask(true);
						}}
					/>
				</HStack>

				{itemContext.useResizeHandle ? (
					<Box w={"auto"} {...rightResizeProps} />
				) : (
					""
				)}
			</Box>
			{showAddTask && (
				<AddTask
					isOpen={showAddTask}
					assignee={assignee}
					onClose={() => setShowAddTask(false)}
					setRefresh={setRefresh}
				/>
			)}
		</>
	);
};

export default ItemsRow;
