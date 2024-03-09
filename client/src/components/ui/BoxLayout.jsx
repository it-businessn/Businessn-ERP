import { Box, Text } from "@chakra-ui/react";

const BoxLayout = ({ title, children }) => {
	return (
		<Box p={{ base: "1em", md: "2em" }}>
			<Text fontWeight="bold" mb={"0.5em"}>
				{title}
			</Text>
			<Box
				p="1em"
				bg={"brand.primary_bg"}
				border="2px solid white"
				borderRadius="10px"
				color={"brand.nav_color"}
			>
				{children}
			</Box>
		</Box>
	);
};

export default BoxLayout;
