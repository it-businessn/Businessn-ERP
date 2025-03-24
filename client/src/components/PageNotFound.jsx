import { Flex, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "./ui/button/PrimaryButton";

export default function PageNotFound() {
	const navigate = useNavigate();
	return (
		<Flex
			alignItems="center"
			justifyContent="center"
			flexDirection="column"
			minH="calc(100vh - 192px)"
		>
			<Heading>404</Heading>
			<Text fontSize="18px" mt={3} mb={2}>
				Page Not Found
			</Text>
			<Text mb={6}>The page you're looking for does not seem to exist</Text>
			<PrimaryButton name="Go to Home" onOpen={() => navigate("/login")} />
		</Flex>
	);
}
