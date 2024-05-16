import { Badge, Box, Card, CardBody, HStack, VStack } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import moment from "moment";

const LogActivityList = ({ activities, showLogForm }) => {
	return (
		<Box w="100%">
			<VStack spacing={4} w="100%">
				{activities.map((activity, index) => (
					<Card key={activity} borderWidth="1px" borderRadius="lg" w="100%">
						<CardBody>
							<HStack justifyContent="space-between">
								<Badge bg="brand.logo_bg">{activity.type}</Badge>
								<TextTitle
									mb={2}
									size="sm"
									color="gray.500"
									title={moment(activity.date).format("MMM DD, YYYY hh:mm A Z")}
								/>
							</HStack>
							<TextTitle title={`Description: ${activity.description}`} />
							<TextTitle title={`Duration: ${activity.duration} minutes`} />
						</CardBody>
					</Card>
				))}
			</VStack>
		</Box>
	);
};

export default LogActivityList;
