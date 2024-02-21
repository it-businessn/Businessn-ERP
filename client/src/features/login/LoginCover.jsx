import {
	Avatar,
	AvatarGroup,
	Box,
	DarkMode,
	Flex,
	HStack,
	Heading,
	Stack,
	Text,
	VStack,
	useBreakpointValue,
} from "@chakra-ui/react";
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
					bg="brand.logo_bg"
					direction="column"
					px={{
						base: "4",
						md: "8",
					}}
					height="full"
					color="fg.accent.default"
				>
					<Flex align="center" h="24">
						<Logo />
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
								<AvatarGroup
									size="md"
									max={useBreakpointValue({
										base: 2,
										lg: 5,
									})}
									borderColor="fg.accent.default"
								>
									<Avatar
										name="Ryan Florence"
										src="https://bit.ly/ryan-florence"
									/>
									<Avatar
										name="Segun Adebayo"
										src="https://bit.ly/sage-adebayo"
									/>
									<Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
									<Avatar
										name="Prosper Otemuyiwa"
										src="https://bit.ly/prosper-baba"
									/>
									<Avatar
										name="Christian Nwamba"
										src="https://bit.ly/code-beast"
									/>
								</AvatarGroup>
								<Text fontWeight="medium">Join 10.000+ users</Text>
							</HStack>
						</Stack>
					</Flex>
					<Flex h="24">
						<VStack align="flex-start">
							<Text color="fg.accent.subtle" textStyle="sm">
								© 2023 BusinessN. All rights reserved.
							</Text>
						</VStack>
					</Flex>
				</Flex>
			</DarkMode>
		</Box>
	);
};

export default LoginCover;
