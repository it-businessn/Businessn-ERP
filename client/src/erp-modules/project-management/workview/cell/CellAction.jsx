import { Editable, EditableInput, EditablePreview, Flex, HStack, Tooltip } from "@chakra-ui/react";
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
	type,
	textSize = "sm",
	width = "100%",
	isFile,
	onSave,
	noteIconClicked,
}) => {
	return (
		<>
			<Tooltip label={name} fontSize="xs" hasArrow placement="bottom-start">
				<Flex alignItems={"center"}>
					{isFile ? (
						<NormalTextTitle width={width} size={textSize} title={name} whiteSpace={"nowrap"} />
					) : (
						<Editable
							defaultValue={name}
							onSubmit={(nextValue) => {
								if (nextValue !== name) onSave(nextValue);
							}}
						>
							<EditablePreview
								cursor="pointer"
								width={width}
								size={textSize}
								whiteSpace={"nowrap"}
								padding="0"
							/>
							<EditableInput width={width} />
						</Editable>
					)}
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
					handleEdit={handleEdit}
					isInner={isInner}
					onNoteIconClick={noteIconClicked}
					isFile={isFile}
				/>
				{type !== "file" && <FaRegTrashAlt cursor={"pointer"} onClick={handleDelete} />}
			</HStack>
		</>
	);
};

export default CellAction;
