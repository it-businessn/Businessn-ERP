import { Box, Container, Stack } from "@chakra-ui/react";

const CenterBoxLayout = ({ spacing = "8", children }) => {
	return (
		<Box
			bg={"var(--logo_bg)"}
			py={{
				base: "12",
				md: "24",
			}}
			display="flex"
			minH="100vh"
			alignItems="center"
		>
			<Container
				bg={"var(--main_color)"}
				maxW="md"
				mx={{ base: "3em", md: "auto" }}
				py={{
					base: "10",
					sm: "8",
				}}
				px={{
					base: "4",
					sm: "10",
				}}
				boxShadow={{
					base: "none",
					sm: "xl",
				}}
				borderRadius={"lg"}
			>
				<Stack spacing={spacing}>{children}</Stack>
			</Container>
		</Box>
	);
};

export default CenterBoxLayout;
