import { Flex, HStack, Tooltip } from "@chakra-ui/react";
import { AddTaskButton } from "components/AddTaskButton";
import { TaskButton } from "components/TaskButton";
import NormalTextTitle from "components/ui/NormalTextTitle";
import { FaRegTrashAlt } from "react-icons/fa";

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
	isTopLevel,
	data,
	type,
	setRefresh,
	textSize = "sm",
	width = "100%",
}) => {
	return (
		<>
			<Tooltip label={name} fontSize="xs" hasArrow placement="bottom-start">
				<Flex alignItems={"center"}>
					<NormalTextTitle width={width} size={textSize} title={name} whiteSpace={"nowrap"} />
				</Flex>
			</Tooltip>

			<HStack spacing={2} cursor={totalTask?.length > 0 ? "pointer" : "default"}>
				{totalTask?.length > 0 && (
					<TaskButton
						isTopLevel={isTopLevel}
						isExpanded={isExpanded}
						totalTasks={totalTasks}
						onClick={handleToggle}
						type={type}
					/>
				)}
				<AddTaskButton
					isTopLevel={isTopLevel}
					onClick={handleAddTask}
					handleClick={handleEditProject}
					isInner={isInner}
					data={data}
					type={type}
					setRefresh={setRefresh}
				/>
				{!isTopLevel && <FaRegTrashAlt cursor={"pointer"} onClick={handleDelete} />}
			</HStack>
		</>
	);
};

export default ActionItem;
