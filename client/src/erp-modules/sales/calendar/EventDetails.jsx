import {
	Avatar,
	Card,
	CardBody,
	HStack,
	Image,
	VStack,
} from "@chakra-ui/react";
import LeftIconButton from "components/ui/button/LeftIconButton";
import PrimaryButton from "components/ui/button/PrimaryButton";
import ModalLayout from "components/ui/modal/ModalLayout";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import moment from "moment";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import MeetingDetails from "./MeetingDetails";

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
		<ModalLayout hideOverlay size="xs" isOpen={isOpen} onClose={onClose}>
			<Card maxW="xs">
				<Image
					src="https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					alt="Green double couch with wooden legs"
				/>
				<CardBody p={3}>
					<HStack spacing="0" align={"flex-start"}>
						<VStack spacing="0" flex={1}>
							<TextTitle
								title={moment(event?.fromDate).format("ddd")}
								size="2xl"
							/>
							<NormalTextTitle
								title={moment(event?.fromDate).format("DD MMM YYYY")}
								size="sm"
							/>
							<NormalTextTitle
								size="sm"
								title={moment(event?.start).format("hh:mm A")}
							/>
						</VStack>

						<VStack spacing="0" flex={1} align={"flex-start"}>
							<TextTitle size="2xl" title={event?.title} />
							<NormalTextTitle size="sm" title={event?.description} />
							<HStack fontSize="xs">
								<Avatar size={"sm"} name={event?.meetingAttendees[0]} />
								<VStack spacing="0" align={"flex-start"}>
									<TextTitle title={event?.meetingAttendees[0]} />
									<NormalTextTitle size={"sm"} title={event?.description} />
								</VStack>
							</HStack>
						</VStack>
					</HStack>
					<HStack spacing="2" mt={3} w={"100%"}>
						<PrimaryButton
							flex={1}
							size={"xs"}
							name={"Meeting Details"}
							loadingText="Loading"
							onOpen={() => setShowDetails(true)}
						/>
						<LeftIconButton
							name={"Edit"}
							flex={0.5}
							handleClick={() => setShowEditDetails(true)}
							icon={<FaEdit />}
							colorScheme={"blue"}
						/>
					</HStack>
					{showDetails && <MeetingDetails event={event} />}
				</CardBody>
			</Card>
		</ModalLayout>
	);
};

export default EventDetails;
