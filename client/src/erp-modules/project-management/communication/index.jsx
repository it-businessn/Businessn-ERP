import {
	Avatar,
	Box,
	Button,
	Flex,
	HStack,
	IconButton,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";
import Conversation from "./Conversation";

const Communications = () => {
	const [conversations, setConversations] = useState([]);
	const [groups, setGroups] = useState(null);
	const [groupMembers, setGroupMembers] = useState(null);
	const [selectedGroup, setSelectedGroup] = useState(null);
	const [selectedGroupMember, setSelectedGroupMember] = useState(null);
	const userId = LocalStorageService.getItem("user")._id;

	useEffect(() => {
		const fetchAllGroups = async () => {
			try {
				const response = await UserService.getAllMemberGroups(userId);
				setGroups(response.data);
				response.data[0].members.forEach((member) => {
					member.baseModule = response.data[0].modules;
					member.group = response.data[0].name;
				});
				setGroupMembers(
					response.data[0].members.filter((member) => member._id !== userId),
				);
				setSelectedGroup(response.data[0]);
			} catch (error) {
				console.error(error);
			}
		};

		fetchAllGroups();
	}, []);

	const handleGroupClick = (group) => {
		setSelectedGroup(group);
		setGroupMembers(group.members.filter((member) => member._id !== userId));
		setSelectedGroupMember(null);
	};
	const handleMemberClick = (member) => setSelectedGroupMember(member);

	return (
		<Box p={{ base: "1em", md: "2em" }} mt={{ base: "3em", md: 0 }}>
			<Text fontWeight="bold" mb={"0.5em"}>
				Communication
			</Text>

			<Flex
				bg={"brand.primary_bg"}
				border="1px solid var(--main_color)"
				borderRadius="10px"
				color={"brand.nav_color"}
			>
				<Box
					borderRight="2px solid #eee"
					h={`calc(100vh - 12em)`}
					maxW={{ md: "24vw", lg: "18vw", xl: "12vw" }}
					p={"1em"}
					minW={{ md: "24vw", lg: "18vw", xl: "12vw" }}
				>
					<Text fontWeight="bold" mb={"0.5em"}>
						Groups
					</Text>
					<Stack justify="start" width="full" my={0} spacing={0}>
						<VStack align="stretch" spacing={0}>
							{groups?.map((group) => (
								<HStack
									key={group._id}
									spacing={0}
									cursor="pointer"
									onClick={() => handleGroupClick(group)}
								>
									<IconButton
										icon={<FaUsers />}
										variant={"ghost"}
										color={
											selectedGroup._id === group._id
												? "var(--primary_button_bg)"
												: "var(--calendar_color)"
										}
										size="xs"
										aria-label="Calendar Icon"
									/>
									<Button
										justifyContent={"space-between"}
										p={0}
										variant="ghost"
										color={
											selectedGroup._id === group._id
												? "var(--primary_button_bg)"
												: "var(--calendar_color)"
										}
										fontSize="xs"
									>
										<Text fontWeight="bold">{group?.name}</Text>
									</Button>
								</HStack>
							))}
						</VStack>
					</Stack>
				</Box>
				<Box
					borderRight="2px solid #eee"
					h={`calc(100vh - 12em)`}
					maxW={{ md: "24vw", lg: "18vw", xl: "15vw" }}
					minW={{ md: "24vw", lg: "18vw", xl: "15vw" }}
				>
					<Text fontWeight="bold" mb={"0.5em"} p={"1em"}>
						Team members
					</Text>
					<VStack align="stretch" spacing={2}>
						{groupMembers?.map((member) => (
							<HStack
								key={member._id}
								spacing={"1em"}
								bg={
									selectedGroupMember?._id === member._id && "var(--bg_color_1)"
								}
								px={"1em"}
								py={"0.5em"}
								cursor="pointer"
								borderLeft={
									selectedGroupMember?._id === member._id &&
									"3px solid var(--primary_button_bg)"
								}
								onClick={() => handleMemberClick(member)}
							>
								<Avatar src={member?.fullName} name={member?.fullName} />

								<Button
									justifyContent={"space-between"}
									p={0}
									variant="ghost"
									fontSize="xs"
								>
									<VStack align={"self-start"}>
										<Text fontWeight="bold">{member?.fullName}</Text>
										<Text fontWeight="bold">
											{
												conversations
													?.slice()
													.reverse()
													.find((id) => id.sender === member._id)?.text
											}
										</Text>
									</VStack>
								</Button>
							</HStack>
						))}
					</VStack>
				</Box>
				<Conversation
					userId={userId}
					conversations={conversations}
					setConversations={setConversations}
					groupMembers={groupMembers}
					selectedGroup={selectedGroup}
					selectedGroupMember={selectedGroupMember}
				/>
			</Flex>
		</Box>
	);
};

export default Communications;
