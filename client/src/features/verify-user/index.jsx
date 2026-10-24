import { Center, Heading, Stack } from "@chakra-ui/react";
import CenterBoxLayout from "layouts/CenterBoxLayout";
import VerifyPIN from "./VerifyPIN";

const VerifyEmail = () => {
	return (
		<CenterBoxLayout>
			<Stack spacing={{ base: "6", md: "3" }} textAlign="center">
				<Heading size={{ base: "xs", md: "sm" }}>Verify your e-mail</Heading>
				<Center fontSize="sm" color="gray.600">
					We have sent a verification code to
				</Center>
				<VerifyPIN />
			</Stack>
		</CenterBoxLayout>
	);
};
export default VerifyEmail;
