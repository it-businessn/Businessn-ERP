import { Box, Container, Stack } from "@chakra-ui/react";

const CenterBoxLayout = (props) => {
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
				py={{
					base: "0",
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
				borderRadius={{
					base: "none",
					sm: "xl",
				}}
			>
				<Stack spacing="8">{props.children}</Stack>
			</Container>
		</Box>
	);
};

export default CenterBoxLayout;
