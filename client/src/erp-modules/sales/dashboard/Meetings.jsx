import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
	Avatar,
	Box,
	Flex,
	Icon,
	IconButton,
	Select,
	SimpleGrid,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	VStack,
} from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import SortableTh from "components/ui/table/SortableTh";
import TextTitle from "components/ui/text/TextTitle";
import { activityChartData, doughnutOptions, leaderBoardData } from "constant";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import useSortableData from "hooks/useSortableData";
import { useEffect, useState } from "react";
import { Doughnut } from "components/ui/charts";
import UserService from "services/UserService";

const Meetings = () => {
	const [agents, setAgents] = useState(null);
	const leaderBoard = useSortableData(leaderBoardData);
	const contacts = useSortableData(agents);
	useEffect(() => {
		const fetchAllAgents = async () => {
			try {
				const { data } = await UserService.getAllUsers();
				// setAgents(data.filter((user) => user.role.includes("Sales")));
				setAgents(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllAgents();
	}, []);
	return (
		<SimpleGrid columns={{ base: 1, md: 1, lg: 3 }} spacing="1em">
			<BoxCard px="1em" fontWeight="bold" h="350px">
				<Flex justify="space-between" align="center" mb="1" color={"var(--nav_color)"}>
					<Text fontWeight="bold">Leaderboard</Text>
					<Select width="auto" border={"none"} fontSize={"xs"} ml={"1em"}>
						<option>This month</option>
						<option>Last Month</option>
					</Select>
				</Flex>
				<Box overflow="auto" h="85%" css={tabScrollCss}>
					<Table size="sm" color={"var(--nav_color)"} bg={"var(--primary_bg)"}>
						<Thead>
							<Tr>
								<SortableTh
									sortKey="position"
									sortConfig={leaderBoard.sortConfig}
									onSort={leaderBoard.requestSort}
									p={0}
								>
									Position
								</SortableTh>
								<SortableTh
									sortKey="salesperson"
									sortConfig={leaderBoard.sortConfig}
									onSort={leaderBoard.requestSort}
								>
									Salesperson{" "}
								</SortableTh>
								<SortableTh
									sortKey="category"
									sortConfig={leaderBoard.sortConfig}
									onSort={leaderBoard.requestSort}
								>
									Category
								</SortableTh>
								<SortableTh
									sortKey="value"
									sortConfig={leaderBoard.sortConfig}
									onSort={leaderBoard.requestSort}
								>
									Value
								</SortableTh>
							</Tr>
						</Thead>
						<Tbody color={"var(--nav_color)"}>
							{leaderBoard.sortedItems.map((item, index) => (
								<Tr key={`${item.position}-${item.salesperson}`}>
									<Td fontSize={"xs"} p={0}>
										{item.position}
									</Td>
									<Td fontSize={"xs"}>{item.salesperson}</Td>
									<Td fontSize={"xs"}>
										<Flex align="center">
											<Icon as={item.icon} />
											<Text ml="2"> {item.category}</Text>
										</Flex>
									</Td>
									<Td fontSize={"xs"}>
										${item.value}
										<Text fontSize={"xs"} as={"span"} fontWeight="normal">
											{`/ this month`}
										</Text>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</Box>
			</BoxCard>
			<BoxCard px="1em" fontWeight="bold" h={{ base: "auto", md: "350px" }}>
				<TextTitle title={"Activity Tracking"} mt="2" mb="1" />
				<VStack spacing={0}>
					<Box h={"30px"} />
					<Box w={{ base: "50%", md: "50%", lg: "100%", xl: "50%" }} m={"0 auto"}>
						<Doughnut data={activityChartData} options={doughnutOptions("50%")} />
					</Box>
				</VStack>
			</BoxCard>
			<BoxCard fontWeight="bold" h="350px" px="1em">
				<Text mt={2} mb={3} fontWeight="bold">
					Contacts Added
				</Text>
				<Box overflow="auto" h="85%" css={tabScrollCss}>
					<Table size="sm" color={"var(--nav_color)"} bg={"var(--primary_bg)"}>
						<Thead>
							<Tr>
								<Th p={0}>#ID</Th>
								<SortableTh sortKey="fullName" sortConfig={contacts.sortConfig} onSort={contacts.requestSort}>
									{" "}
									Name
								</SortableTh>
								<SortableTh sortKey="email" sortConfig={contacts.sortConfig} onSort={contacts.requestSort}>
									Email
								</SortableTh>
								<Th></Th>
							</Tr>
						</Thead>
						<Tbody border={"none"} color={"var(--nav_color)"}>
							{contacts.sortedItems?.map(({ _id, fullName, email }, index) => (
								<Tr key={_id}>
									<Td fontSize={"xs"} p={0}>
										#{index + 1}
									</Td>
									<Td fontSize={"xs"} border={"none"} py={0}>
										<Flex align="center">
											<Avatar
												size="sm"
												src={null}
												// src={item.profilePic}
												name={fullName}
											/>
											<Text ml="2">{fullName}</Text>
										</Flex>
									</Td>
									<Td fontSize={"xs"} border={"none"} py={0}>
										{email}
									</Td>
									<Td border={"none"} py={0}>
										<IconButton
											icon={<ArrowForwardIcon size="xs" />}
											borderRadius="full"
											size={"xs"}
											color="purple.500"
											bg={"#dedaf4"}
											_hover={{ bg: "#8385d5", color: "var(--main_color)" }}
										/>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</Box>
			</BoxCard>
		</SimpleGrid>
	);
};

export default Meetings;
