import { Avatar, Checkbox, HStack, Td, Text, Tr } from "@chakra-ui/react";
import React, { useState } from "react";
import ProjectService from "services/ProjectService";

const Subtask = ({ id, task }) => {
	const { _id, taskName, selectedAssignees, completed } = task;

	const [isOpenTask, setIsOpenTask] = useState(completed);

	const handleTaskStatus = async (e, taskId) => {
		const isOpen = e.target.checked;
		setIsOpenTask(isOpen);
		try {
			await ProjectService.updateSubTaskStatus({ isOpen }, taskId);
		} catch (error) {
			console.error("Error updating subtask status:", error);
		}
	};
	return (
		<React.Fragment key={_id}>
			<Tr>
				<Td>
					<HStack spacing={3}>
						<Checkbox
							isChecked={isOpenTask}
							sx={{ verticalAlign: "middle" }}
							colorScheme="facebook"
							onChange={(e) => handleTaskStatus(e, _id)}
						/>
						<Text fontSize={"xs"}>{taskName}</Text>
						{selectedAssignees?.map((assignee) => (
							<Avatar name={assignee} size={"xs"} src={assignee} />
						))}
					</HStack>
				</Td>
			</Tr>
		</React.Fragment>
	);
};

export default Subtask;
