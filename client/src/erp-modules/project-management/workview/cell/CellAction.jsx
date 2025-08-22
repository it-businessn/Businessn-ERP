import { Flex, HStack, Tooltip } from "@chakra-ui/react";
import { AddTaskButton } from "components/AddTaskButton";
import { TaskButton } from "components/TaskButton";
import NormalTextTitle from "components/ui/NormalTextTitle";
import { FaRegTrashAlt } from "react-icons/fa";

const CellAction = ({
	name,
	totalTasks,
	handleEdit,
	handleAdd,
	handleToggle,
	totalTask,
	isInner,
	isExpanded,
	handleDelete,
	data,
	type,
	setRefresh,
	textSize = "sm",
	width = "100%",
	isFile,
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
						isExpanded={isExpanded}
						totalTasks={totalTasks}
						onClick={handleToggle}
						type={type}
						isFile={isFile}
					/>
				)}
				<AddTaskButton
					onClick={handleAdd}
					handleClick={handleEdit}
					isInner={isInner}
					data={data}
					type={type}
					setRefresh={setRefresh}
					isFile={isFile}
				/>
				{type !== "file" && <FaRegTrashAlt cursor={"pointer"} onClick={handleDelete} />}
			</HStack>
		</>
	);
};

export default CellAction;
