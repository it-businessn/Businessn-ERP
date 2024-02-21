import {
	Badge,
	Box,
	Card,
	CardBody,
	HStack,
	Text,
	VStack,
} from "@chakra-ui/react";
import moment from "moment";

const LogActivityList = ({ activities, showLogForm }) => {
	return (
		<Box w="100%">
			<VStack spacing={4} w="100%">
				{activities.map((activity, index) => (
					<Card key={index} borderWidth="1px" borderRadius="lg" w="100%">
						<CardBody>
							<HStack justifyContent="space-between">
								<Badge bg="brand.logo_bg">{activity.type}</Badge>
								<Text fontSize="sm" color="gray.500">
									{moment(activity.date).format("MMM DD, YYYY hh:mm A Z")}
								</Text>
							</HStack>
							<Text mt={2}>Description: {activity.description}</Text>
							<Text>Duration: {activity.duration} minutes</Text>
						</CardBody>
					</Card>
				))}
			</VStack>
		</Box>
	);
};

export default LogActivityList;
