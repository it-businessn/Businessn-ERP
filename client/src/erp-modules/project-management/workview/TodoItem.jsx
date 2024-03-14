import { Avatar, Checkbox, HStack, Td, Text, Tr } from "@chakra-ui/react";
import React, { useState } from "react";
import ProjectService from "services/ProjectService";

const TodoItem = ({ task }) => {
	const { _id, name, selectedAssignees, isOpen } = task;

	const [isOpenTask, setIsOpenTask] = useState(!isOpen);

	const handleTaskStatus = async (e, taskId) => {
		const isOpen = e.target.checked;
		setIsOpenTask(isOpen);
		try {
			await ProjectService.updateTaskActivityStatus({ isOpen }, taskId);
		} catch (error) {
			console.error("Error updating subtask status:", error);
		}
	};
	return (
		<React.Fragment key={_id}>
			<Tr key={name}>
				<Td>
					<HStack spacing={3}>
						<Checkbox
							isChecked={isOpenTask}
							onChange={(e) => handleTaskStatus(e, _id)}
							sx={{ verticalAlign: "middle" }}
							colorScheme="facebook"
						/>
						<Text fontSize={"xs"}>{name}</Text>
						<Avatar
							name={selectedAssignees}
							size={"xs"}
							src={selectedAssignees}
						/>
					</HStack>
				</Td>
			</Tr>
		</React.Fragment>
	);
};

export default TodoItem;
