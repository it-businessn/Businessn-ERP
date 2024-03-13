import { Avatar, Checkbox, HStack, Td, Text, Tr } from "@chakra-ui/react";
import React from "react";

const Subtask = ({ task }) => {
	const { taskName, selectedAssignees } = task;
	return (
		<React.Fragment key={taskName}>
			<Tr>
				<Td>
					<HStack spacing={3}>
						<Checkbox sx={{ verticalAlign: "middle" }} colorScheme="facebook" />
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
