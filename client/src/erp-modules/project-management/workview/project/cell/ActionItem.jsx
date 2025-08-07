import { HStack, Text, Tooltip } from "@chakra-ui/react";
import { FaRegTrashAlt } from "react-icons/fa";
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
	handleDelete,
	isProject,
	data,
	type,
	setRefresh,
}) => {
	return (
		<>
			<Tooltip label={name} fontSize="xs" hasArrow>
				<Text overflow={"hidden"} whiteSpace={"nowrap"} textOverflow={"ellipsis"} w={"160px"}>
					{name}
				</Text>
			</Tooltip>

			<HStack spacing={2} cursor={totalTask?.length > 0 ? "pointer" : "default"}>
				{totalTask?.length > 0 && (
					<TaskButton isExpanded={isExpanded} totalTasks={totalTasks} onClick={handleToggle} />
				)}
				<AddTaskButton
					onClick={handleAddTask}
					handleClick={handleEditProject}
					isInner={isInner}
					data={data}
					type={type}
					setRefresh={setRefresh}
				/>
				{!isProject && <FaRegTrashAlt cursor={"pointer"} onClick={handleDelete} />}
			</HStack>
		</>
	);
};

export default ActionItem;
