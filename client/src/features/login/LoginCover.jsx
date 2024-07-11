import {
	Box,
	DarkMode,
	Flex,
	HStack,
	Heading,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import AvatarGroups from "components/ui/AvatarGroup";
import Logo from "../../components/logo";

const LoginCover = () => {
	return (
		<Box
			flex="1"
			display={{
				base: "none",
				md: "block",
			}}
		>
			<DarkMode>
				<Flex
					bg="var(--logo_bg)"
					direction="column"
					px={{
						base: "4",
						md: "8",
					}}
					height="full"
					color="fg.accent.default"
				>
					<Flex align="center" h="24">
						<Logo isCover />
					</Flex>
					<Flex flex="1" align="center">
						<Stack spacing="8">
							<Stack spacing="6">
								<Heading
									size={{
										md: "lg",
										xl: "xl",
									}}
								>
									Connect, Collaborate, Conquer.
								</Heading>
								<Text textStyle="lg" maxW="md" fontWeight="medium">
									Your CRM Journey Starts with a Login.
								</Text>
							</Stack>
							<HStack spacing="4">
								<AvatarGroups />
								<Text fontWeight="medium">Join 10.000+ users</Text>
							</HStack>
						</Stack>
					</Flex>
					<Flex h="24">
						<VStack align="flex-start">
							<Text color="fg.accent.subtle" textStyle="sm">
								© {new Date().getFullYear()} BusinessN. All rights reserved.
							</Text>
						</VStack>
					</Flex>
				</Flex>
			</DarkMode>
		</Box>
	);
};

export default LoginCover;
