import { Box, Text } from "@chakra-ui/react";

const SectionLayout = ({ title, children }) => {
	return (
		<Box p={{ base: "1em", md: "2em" }} pt={{ base: "4em", md: "auto" }}>
			<Text fontWeight="bold" mb={"0.5em"}>
				{title}
			</Text>
			<Box
				p="1em"
				bg={"brand.primary_bg"}
				border="2px solid var(--main_color)"
				borderRadius="10px"
				color={"brand.nav_color"}
			>
				{children}
			</Box>
		</Box>
	);
};

export default SectionLayout;
