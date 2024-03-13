import { Avatar, Checkbox, HStack, Td, Text, Tr } from "@chakra-ui/react";
import React from "react";

const TodoItem = ({ task }) => {
	const { taskName, selectedAssignee } = task;
	return (
		<React.Fragment key={taskName}>
			<Tr key={taskName}>
				<Td>
					<HStack spacing={3}>
						<Checkbox sx={{ verticalAlign: "middle" }} colorScheme="facebook" />
						<Text fontSize={"xs"}>{taskName}</Text>
						<Avatar
							name={selectedAssignee}
							size={"xs"}
							src={selectedAssignee}
						/>
					</HStack>
				</Td>
			</Tr>
		</React.Fragment>
	);
};

export default TodoItem;
