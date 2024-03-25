import { DeleteIcon } from "@chakra-ui/icons";
import { Button, HStack, Text } from "@chakra-ui/react";
import { AddTaskButton, TaskButton, generateLighterShade } from "utils";
import { COLORS } from "../data";

const ActionItem = ({
	name,
	totalTasks,
	handleEditProject,
	handleAddTask,
	handleToggle,
	totalTask,
	isInner,
	isExpanded,
	handleDelete,
	isProject,
}) => {
	return (
		<>
			<Text>{name}</Text>

			<HStack
				spacing={2}
				cursor={totalTask?.length > 0 ? "pointer" : "default"}
			>
				{totalTask?.length > 0 && (
					<TaskButton
						isExpanded={isExpanded}
						totalTasks={totalTasks}
						onClick={handleToggle}
					/>
				)}
				<AddTaskButton
					onClick={handleAddTask}
					handleClick={handleEditProject}
					isInner={isInner}
				/>
				{!isProject && (
					<Button
						onClick={handleDelete}
						size="xxs"
						display={"flex"}
						variant="ghost"
						fontWeight={"bold"}
						color="brand.nav_color"
						_hover={{
							bg: generateLighterShade(COLORS.primary, 0.8),
							color: "brand.nav_color",
						}}
					>
						<DeleteIcon />
					</Button>
				)}
			</HStack>
		</>
	);
};

export default ActionItem;
