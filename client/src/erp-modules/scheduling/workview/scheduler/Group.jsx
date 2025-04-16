import { Text } from "@chakra-ui/react";

const Group = ({ group, drop, isOver, handleHourDrop }) => {
	return group.id ? (
		<Text
			whiteSpace={"pre-wrap"}
			className="custom-group"
			// ref={drop}
			fontSize={"sm"}
			fontWeight={"normal"}
			// border={isOver && "2px solid #ccc"}
			bgColor={"transparent"}
			onDrop={handleHourDrop}
		>
			{group.title}
		</Text>
	) : (
		<></>
	);
};

export default Group;
