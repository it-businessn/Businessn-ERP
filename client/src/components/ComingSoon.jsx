import { TimeIcon } from "@chakra-ui/icons";
import { Box, Icon, Text, VStack } from "@chakra-ui/react";

export default function ComingSoon({ message }) {
	return (
		<Box
			maxWidth="600px"
			mx="auto"
			mt="50px"
			p="6"
			borderWidth="1px"
			borderRadius="lg"
			boxShadow="lg"
			bg="white"
		>
			<VStack spacing={6} align="center" p={4}>
				<Icon as={TimeIcon} w={12} h={12} color="var(--banner_bg)" />
				<Text fontSize="2xl" fontWeight="bold" color="var(--banner_bg)">
					Coming Soon
				</Text>
				<Text fontSize="md" textAlign="center" color="gray.600">
					{message}
				</Text>
			</VStack>
		</Box>
	);
}
