import { Badge, Box, Card, CardBody, Flex, VStack } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import moment from "moment";

const LogActivityList = ({ activities, showLogForm }) => {
	return (
		<Box w="100%">
			<VStack spacing={4} w="100%">
				{activities.map(({ _id, type, createdOn, duration, description }) => (
					<Card key={_id} borderWidth="1px" borderRadius="lg" w="100%">
						<CardBody>
							<Flex justifyContent="space-between">
								<Badge bg="var(--primary_bg)" color="var(--primary_button_bg)">
									{type}
								</Badge>
								<NormalTextTitle
									size="sm"
									// title={moment(createdOn).format("MMM DD, YYYY hh:mm A Z")}
									title={moment(createdOn).format("MMM DD, YYYY hh:mm A")}
									color="gray.500"
									align="end"
								/>
							</Flex>
							<NormalTextTitle title={`${description}`} />
							{duration !== "0" && (
								<TextTitle title={`Duration: ${duration} minutes`} />
							)}
						</CardBody>
					</Card>
				))}
			</VStack>
		</Box>
	);
};

export default LogActivityList;
