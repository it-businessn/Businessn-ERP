import { Text } from "@chakra-ui/react";

const Group = ({ group }) => {
	return group.id ? (
		<Text
			whiteSpace={"pre-wrap"}
			className="custom-group"
			fontSize={"sm"}
			fontWeight={"normal"}
			bgColor={"transparent"}
		>
			{group.title}
		</Text>
	) : (
		<></>
	);
};

export default Group;
