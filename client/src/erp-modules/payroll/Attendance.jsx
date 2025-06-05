import { TimeIcon } from "@chakra-ui/icons";
import { Box, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import PageLayout from "layouts/PageLayout";
import { tabScrollCss } from "./onboard-user/customInfo";

const Attendance = () => {
	return (
		<PageLayout title="Attendance">
			<Flex
				width="100%"
				height="calc(100vh - 200px)"
				align="center"
				justify="center"
				css={tabScrollCss}
			>
				<Box maxWidth="600px" p="6" borderWidth="1px" borderRadius="lg" boxShadow="lg" bg="white">
					<VStack spacing={6} align="center" p={4}>
						<Icon as={TimeIcon} w={12} h={12} color="blue.500" />
						<Text fontSize="2xl" fontWeight="bold" color="blue.600">
							Coming Soon
						</Text>
						<Text fontSize="md" textAlign="center" color="gray.600">
							We are currently working on this module to allow you to track and manage attendance.
							We will let you know as soon as it's completed. Thank you.
						</Text>
					</VStack>
				</Box>
			</Flex>
		</PageLayout>
	);
};

export default Attendance;
