import { Avatar, Box, HStack, Spacer, Text, VStack } from "@chakra-ui/react";
import moment from "moment";
import LocalStorageService from "services/LocalStorageService";

const MessageBubble = ({
	message,
	isMyMessage,
	timestamp,
	selectedGroupMember,
	isDashboard,
}) => {
	const userName = LocalStorageService.getItem("user").fullName;

	moment.updateLocale("en", {
		relativeTime: {
			future: "in %s",
			past: "%s ago",
			s: "a few seconds",
			ss: "%ds",
			m: "a minute",
			mm: "%dm",
			h: "an hour",
			hh: "%dh",
			d: "a day",
			dd: "%dd",
			M: "a month",
			MM: "%dM",
			y: "a year",
			yy: "%dY",
		},
	});
	timestamp = moment(timestamp).fromNow();
	return (
		<HStack w={"100%"} spacing={isDashboard ? 1 : 0}>
			{isMyMessage && <Spacer />}
			{isDashboard && !isMyMessage && (
				<Avatar
					size={"sm"}
					src={selectedGroupMember}
					name={selectedGroupMember}
				/>
			)}
			<Box w={"70%"}>
				<Box
					borderRadius="lg"
					borderBottomLeftRadius={!isMyMessage && "0"}
					borderBottomRightRadius={isMyMessage && "0"}
					bg={
						isMyMessage ? "var(--primary_button_bg)" : "var(--receiver_msg_bg)"
					}
					color={isMyMessage ? "var(--main_color)" : "black"}
					px={3}
					py={1.5}
					justifyContent={isMyMessage ? "flex-end" : "flex-start"}
				>
					<VStack alignItems={"self-start"} spacing={0}>
						{isMyMessage || selectedGroupMember === userName ? (
							!isDashboard && (
								<Text fontSize="xs" fontWeight={"bold"}>
									You
								</Text>
							)
						) : (
							<Text fontSize="xs" fontWeight={"bold"}>
								{selectedGroupMember}
							</Text>
						)}

						<Text fontSize="xs" fontWeight={"normal"}>
							{message}
						</Text>
					</VStack>
				</Box>

				<Text
					fontSize="xs"
					fontWeight={"normal"}
					textAlign={isMyMessage && "right"}
				>
					{timestamp}
				</Text>
			</Box>
			{!isMyMessage && <Spacer />}
		</HStack>
	);
};

export default MessageBubble;
