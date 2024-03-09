import { Box, Center, Spinner } from "@chakra-ui/react";

const Loader = () => {
	return (
		<Center>
			<Box
				display="flex"
				alignItems="center"
				justifyContent="center"
				height="100vh"
			>
				<Spinner size="xl" colorScheme={"var(--primary_button_bg)"} />
			</Box>
		</Center>
	);
};

export default Loader;
