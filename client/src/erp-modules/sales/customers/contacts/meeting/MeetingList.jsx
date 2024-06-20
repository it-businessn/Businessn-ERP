import {
	Badge,
	Box,
	Card,
	CardBody,
	Flex,
	Text,
	VStack,
} from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import moment from "moment";
import { Link } from "react-router-dom";

const MeetingList = ({ meetings }) => {
	return (
		<Box w="100%">
			<VStack spacing={4} w="100%">
				{meetings?.map(
					({
						_id,
						type,
						createdOn,
						description,
						attendees,
						location,
						fromDate,
						fromTime,
						meetingLink,
					}) => (
						<Card key={_id} borderWidth="1px" borderRadius="lg" w="100%">
							<CardBody fontSize={"sm"}>
								<Flex justifyContent="space-between">
									<Badge
										bg="var(--primary_bg)"
										color="var(--primary_button_bg)"
									>
										{type}
									</Badge>
									<TextTitle
										weight="normal"
										size="sm"
										// title={moment(createdOn).format("MMM DD, YYYY hh:mm A Z")}
										title={moment(createdOn).format("MMM DD, YYYY hh:mm A")}
										color="gray.500"
										align="end"
									/>
								</Flex>
								<Text mt={2}>Description: {description}</Text>
								<Text>
									Attendees:{" "}
									<Text as={"span"}>
										{attendees?.map((_) => (
											<Text as={"span"} key={_}>
												{_}
												{attendees.length > 1 && ","}
											</Text>
										))}
									</Text>
								</Text>
								<Text>Location: {location} </Text>
								<Text>
									Meeting Date: {moment(fromDate).format("MMM DD, YYYY ")}
									{fromTime}
								</Text>
								<Text fontWeight={"bold"}>
									Meeting Link:{" "}
									<Link href={meetingLink} isexternal={true}>
										<Text as="span" color="blue.400">
											{meetingLink}
										</Text>
									</Link>
								</Text>
							</CardBody>
						</Card>
					),
				)}
			</VStack>
		</Box>
	);
};

export default MeetingList;
