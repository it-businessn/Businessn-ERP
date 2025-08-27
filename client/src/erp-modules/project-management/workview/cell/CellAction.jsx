import { HStack } from "@chakra-ui/react";
import { AddTaskButton } from "components/AddTaskButton";
import { TaskDropdown } from "components/TaskDropdown";
import { FaRegTrashAlt } from "react-icons/fa";
import { FileDescription } from "./FileDescription";

const CellAction = ({
	totalTasks,
	handleEdit,
	handleAdd,
	handleToggle,
	totalTask,
	isInner,
	isExpanded,
	handleDelete,
	type,
	isFile,
	noteIconClicked,
	name,
	textSize,
	width,
	onSave,
}) => {
	return (
		<>
			<FileDescription
				name={name}
				textSize={textSize}
				width={width}
				onSave={onSave}
				isFile={isFile}
			/>

			<HStack spacing={2}>
				{totalTask?.length > 0 && (
					<TaskDropdown
						isExpanded={isExpanded}
						totalTasks={totalTasks}
						onClick={handleToggle}
						type={type}
						isFile={isFile}
					/>
				)}
				<AddTaskButton
					handleAdd={handleAdd}
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
