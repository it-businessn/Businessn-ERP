import { Box, Text } from "@chakra-ui/react";

const Workbench = () => {
	return (
		<Box p={{ base: "1em", md: "2em" }} overflow={"hidden"}>
			<Text fontWeight="bold" mb={"0.5em"}>
				Workbench
			</Text>
		</Box>
	);
};

export default Workbench;
