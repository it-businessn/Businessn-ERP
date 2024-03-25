import { HStack, Text } from "@chakra-ui/react";
import { AddTaskButton, TaskButton } from "utils";

const ActionItem = ({
	name,
	totalTasks,
	handleEditProject,
	handleAddTask,
	handleToggle,
	totalTask,
	isInner,
	isExpanded,
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
			</HStack>
		</>
	);
};

export default ActionItem;
