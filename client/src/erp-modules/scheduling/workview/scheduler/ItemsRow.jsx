import { SmallAddIcon } from "@chakra-ui/icons";
import { Box, Button, HStack, IconButton } from "@chakra-ui/react";
import moment from "moment";
import { useState } from "react";
import AddTask from "./AddTask";

const ItemsRow = ({ getItemProps, item, itemContext, setRefresh, handleItemClick }) => {
	const durationText = item.duration < 2 ? "hour" : "hours";
	const [showAddTask, setShowAddTask] = useState(false);
	const [assignee, setAssignee] = useState("");
	const { location, role, shiftStart, shiftEnd } = item;
	const start = moment(shiftStart, "HH:mm");
	const end = moment(shiftEnd, "HH:mm");
	const formatNoM = (time) => time?.format("hA").replace("AM", "a").replace("PM", "p");
	const formatted = `${formatNoM(start)} - ${formatNoM(end)}`;

	return (
		<>
			<Box {...getItemProps(item.itemProps)} w={"auto"}>
				<HStack
					maxHeight={"3em"}
					bgColor={item.color}
					borderRadius={"50px"}
					px={"1"}
					py={0}
					spacing={0}
					justify={"space-between"}
				>
					{/* <Avatar size={"xs"} name={itemContext.title} /> */}
					{/* <Button variant="ghost" size="xs" color={"var(--bg_color_1)"}>
						{`${item.duration} ${durationText}`}
					</Button> */}
					<Button variant="ghost" size="xs" color={"var(--bg_color_1)"}>
						{formatted}
						{/* {`${formatted}
						 ${role} ${location}
						 `} */}
					</Button>
					<IconButton
						size={"xs"}
						icon={<SmallAddIcon />}
						aria-label="Open Sidebar"
						_hover={{ bg: "transparent" }}
						onClick={() => {
							handleItemClick(item);
						}}
					/>
				</HStack>
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
