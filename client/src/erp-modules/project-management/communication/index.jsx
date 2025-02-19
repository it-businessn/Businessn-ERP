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
import TextTitle from "components/ui/text/TextTitle";

import NormalTextTitle from "components/ui/NormalTextTitle";
import useCompany from "hooks/useCompany";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";
import Conversation from "./Conversation";

const Communications = ({ isDashboard }) => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const loggedInUser = LocalStorageService.getItem("user");
	const [conversations, setConversations] = useState([]);
	const [groups, setGroups] = useState(null);
	const [groupMembers, setGroupMembers] = useState(null);
	const [selectedGroup, setSelectedGroup] = useState(null);
	const [selectedGroupMember, setSelectedGroupMember] = useState(null);
	const userId = LocalStorageService.getItem("user")._id;

	useEffect(() => {
		const fetchAllGroups = async () => {
			try {
				const { data } = await UserService.getAllMemberGroups({
					userId,
					company,
				});
				setGroups(data);
				if (data.length > 0) {
					data[0].members.forEach((member) => {
						member.baseModule = data[0].modules;
						member.group = data[0].name;
					});
					setGroupMembers(data[0].members.filter((member) => member._id !== userId));
					setSelectedGroup(data[0]);
				}
			} catch (error) {
				console.error(error);
			}
		};

		fetchAllGroups();
	}, [company]);

	const handleGroupClick = (group) => {
		setSelectedGroup(group);
		setGroupMembers(group.members.filter((member) => member._id !== userId));
		setSelectedGroupMember(null);
	};
	const handleMemberClick = (member) => setSelectedGroupMember(member);

	return (
		<PageLayout title={"Communication"}>
			{/* <Box
			p={{ base: isDashboard ? 0 : "1em", md: isDashboard ? 0 : "2em" }}
			mt={{ base: isDashboard ? 0 : "3em", md: 0 }}
		> */}
			{/* <Text fontWeight="bold" mb={"0.5em"} display={isDashboard && "none"}>
				Communication
			</Text> */}

			<Flex
				bg={!isDashboard && "var(--primary_bg)"}
				border={!isDashboard && "1px solid var(--main_color)"}
				borderRadius="10px"
				color={"var(--nav_color)"}
			>
				<Box
					display={isDashboard && "none"}
					borderRight="2px solid #eee"
					h={`calc(var(--comms)`}
					maxW={{ md: "24vw", lg: "18vw", xl: "12vw" }}
					p={"1em"}
					minW={{ md: "24vw", lg: "18vw", xl: "12vw" }}
				>
					<Text fontWeight="bold" mb={"0.5em"}>
						Groups
					</Text>
					<Stack justify="start" width="full" my={0} spacing={0}>
						<VStack align="stretch" spacing={0}>
							{(!groups || groups.length === 0) && (
								<TextTitle title={"No group assigned for you."} whiteSpace="pre-wrap" />
							)}
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
										<TextTitle title={group?.name} />
									</Button>
								</HStack>
							))}
						</VStack>
					</Stack>
				</Box>
				{!groups || groups.length === 0 ? (
					<></>
				) : (
					<>
						<Box
							display={isDashboard && "none"}
							borderRight="2px solid #eee"
							h={`calc(var(--comms))`}
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
										bg={selectedGroupMember?._id === member._id && "var(--bg_color_1)"}
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

										<Button justifyContent={"space-between"} p={0} variant="ghost" fontSize="xs">
											<VStack align={"self-start"}>
												<Text fontWeight="bold">{member?.fullName}</Text>
												<NormalTextTitle
													whiteSpace="wrap"
													align={"start"}
													title={
														conversations
															?.slice()
															.reverse()
															.find((id) => id.sender === member._id)?.text
													}
												/>
											</VStack>
										</Button>
									</HStack>
								))}
							</VStack>
						</Box>
						<Conversation
							isDashboard={isDashboard}
							userId={userId}
							user={loggedInUser}
							conversations={conversations}
							setConversations={setConversations}
							groupMembers={groupMembers}
							selectedGroup={selectedGroup}
							selectedGroupMember={selectedGroupMember}
							company={company}
						/>
					</>
				)}
			</Flex>
		</PageLayout>
	);
};

export default Communications;
