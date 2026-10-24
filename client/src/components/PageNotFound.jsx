import { Button, Heading, Stack, Text } from "@chakra-ui/react";
import PublicLayout, { primaryButtonProps } from "layouts/PublicLayout";
import { useNavigate } from "react-router-dom";

// UI-01: same look as the other public pages.
export default function PageNotFound() {
	const navigate = useNavigate();
	return (
		<PublicLayout action="signin">
			<Stack spacing={3} textAlign="center">
				<Heading size="2xl" color="var(--banner_bg)">
					404
				</Heading>
				<Heading size={{ base: "xs", md: "sm" }}>Page not found</Heading>
				<Text color="gray.600" fontSize="sm">
					The page you are looking for does not exist or has moved.
				</Text>
				<Button {...primaryButtonProps} onClick={() => navigate("/login")}>
					Go to sign in
				</Button>
			</Stack>
		</PublicLayout>
	);
}
