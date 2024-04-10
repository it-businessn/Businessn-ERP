import {
	Avatar,
	Button,
	Card,
	CardBody,
	HStack,
	Image,
	Modal,
	ModalContent,
	Text,
	VStack,
} from "@chakra-ui/react";
import moment from "moment";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { formatDate, toCapitalize } from "utils";

const EventDetails = ({
	isOpen,
	onClose,
	event,
	position,
	setShowEditDetails,
}) => {
	// console.log(position);
	const [showDetails, setShowDetails] = useState(false);
	if (!event) {
		onClose();
	}
	return (
		<Modal
			isCentered
			isOpen={isOpen}
			onClose={onClose}
			size={"xs"}
			// style={{
			// 	position: "relative",
			// 	top: position.top,
			// 	left: position.left,
			// }}
		>
			<ModalContent>
				<Card maxW="xs">
					<Image
						src="https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
						alt="Green double couch with wooden legs"
					/>
					<CardBody p={3}>
						<HStack spacing="0" align={"flex-start"}>
							<VStack spacing="0" flex={1}>
								<Text fontWeight={"bold"} fontSize="2xl">
									{moment(event?.fromDate).format("ddd")}
								</Text>
								<Text fontSize="sm">
									{moment(event?.fromDate).format("DD MMM YYYY")}
								</Text>
								<Text fontSize="xs">
									{moment(event?.fromTime, "HH:mm").format("hh:mm A")}
								</Text>
							</VStack>

							<VStack spacing="0" flex={1} align={"flex-start"}>
								<Text fontWeight={"bold"} fontSize="2xl">
									{event?.title}
								</Text>
								<Text fontSize="sm">{event?.description}</Text>
								<HStack fontSize="xs">
									<Avatar size={"sm"} name={event?.meetingAttendees[0]} />
									<VStack spacing="0" align={"flex-start"}>
										<Text fontWeight={"bold"}>
											{event?.meetingAttendees[0]}
										</Text>
										<Text fontSize="sm">{event?.description}</Text>
									</VStack>
								</HStack>
							</VStack>
						</HStack>
						<HStack spacing="2" mt={3} w={"100%"}>
							<Button
								flex={1}
								variant="solid"
								size={"xs"}
								onClick={() => setShowDetails(true)}
								colorScheme="blue"
							>
								Meeting Details
							</Button>
							<Button
								flex={0.5}
								variant="outline"
								size={"xs"}
								onClick={() => setShowEditDetails(true)}
								colorScheme="blue"
								leftIcon={<FaEdit />}
							>
								Edit
							</Button>
						</HStack>
						{showDetails && (
							<VStack align="flex-start" color={"brand.200"} spacing={0}>
								<Text fontWeight="bold">Type</Text>
								<Text fontSize="sm">
									{event?.eventType && toCapitalize(event?.eventType)}
								</Text>
								<Text fontWeight="bold">Description</Text>
								<Text fontSize="sm">{event?.description}</Text>
								<Text fontWeight="bold">Start</Text>
								<Text fontSize="sm">
									{formatDate(event?.fromDate)}{" "}
									{moment(event?.fromTime, "HH:mm").format("hh:mm A")}
								</Text>
								<Text fontWeight="bold">End</Text>
								<Text fontSize="sm">
									{formatDate(event?.toDate)}{" "}
									{moment(event?.toTime, "HH:mm").format("hh:mm A")}
								</Text>

								{event?.eventLink && (
									<>
										<Text fontWeight="bold">Link</Text>
										<Button variant={"link"} fontSize="sm" colorScheme={"blue"}>
											{event?.eventLink}
										</Button>
									</>
								)}
								{event?.location && (
									<>
										<Text fontWeight="bold">Location</Text>
										<Text fontSize="sm">{event?.location}</Text>
									</>
								)}
							</VStack>
						)}
					</CardBody>
				</Card>
			</ModalContent>
		</Modal>
	);
};

export default EventDetails;
