import { SettingsIcon } from "@chakra-ui/icons";
import { HStack, IconButton, Text } from "@chakra-ui/react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
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
			{!isInner && (
				<HStack
					spacing={0}
					cursor={totalTask?.length > 0 ? "pointer" : "default"}
				>
					{totalTask?.length > 0 && <TaskButton totalTasks={totalTasks} />}
					<IconButton
						variant="ghost"
						icon={<SettingsIcon />}
						color="brand.nav_color"
						aria-label="Settings Icon"
						onClick={handleEditProject}
					/>
					<AddTaskButton onClick={handleAddTask} />
					{totalTask?.length > 0 && (
						<IconButton
							onClick={handleToggle}
							variant="ghost"
							icon={isExpanded ? <FaChevronUp /> : <FaChevronDown />}
							color="brand.nav_color"
							aria-label="Calendar Icon"
						/>
					)}
				</HStack>
			)}
		</>
	);
};

export default ActionItem;
