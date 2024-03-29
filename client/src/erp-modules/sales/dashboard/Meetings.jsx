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
import { activityChartData, doughnutOptions, leaderBoardData } from "constant";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import UserService from "services/UserService";

const Meetings = () => {
	const [agents, setAgents] = useState(null);
	useEffect(() => {
		const fetchAllAgents = async () => {
			try {
				const response = await UserService.getAllUsers();
				// setAgents(response.data.filter((user) => user.role.includes("Sales")));
				setAgents(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllAgents();
	}, []);
	return (
		<SimpleGrid columns={{ base: 1, md: 1, lg: 3 }} spacing="1em">
			<Box
				px="1em"
				bg={"brand.primary_bg"}
				border="3px solid var(--main_color)"
				borderRadius="10px"
				fontWeight="bold"
				h="350px"
			>
				<Flex
					justify="space-between"
					align="center"
					mb="1"
					color={"brand.nav_color"}
				>
					<Text fontWeight="bold">Leaderboard</Text>
					<Select width="auto" border={"none"} fontSize={"xs"} ml={"1em"}>
						<option>This month</option>
						<option>Last Month</option>
					</Select>
				</Flex>
				<Box overflow="auto" h="85%">
					<Table size="sm" color={"brand.nav_color"} bg={"brand.primary_bg"}>
						<Thead>
							<Tr>
								<Th p={0}>Position</Th>
								<Th>Salesperson </Th>
								<Th>Category</Th>
								<Th>Value</Th>
							</Tr>
						</Thead>
						<Tbody color={"brand.nav_color"}>
							{leaderBoardData.map((item, index) => (
								<Tr key={index}>
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
			</Box>
			<Box
				px="1em"
				bg={"brand.primary_bg"}
				border="3px solid var(--main_color)"
				borderRadius="10px"
				fontWeight="bold"
				color={"brand.nav_color"}
				h={{ base: "auto", md: "350px" }}
			>
				<Text fontWeight="bold" mt="2" mb="1">
					Activity Tracking
				</Text>
				<VStack spacing={0}>
					<Box h={"30px"} />
					<Box
						w={{ base: "50%", md: "50%", lg: "100%", xl: "50%" }}
						m={"0 auto"}
					>
						<Doughnut
							data={activityChartData}
							options={doughnutOptions("50%")}
						/>
					</Box>
				</VStack>
			</Box>
			<Box
				color={"brand.nav_color"}
				px="1em"
				bg={"brand.primary_bg"}
				border="3px solid var(--main_color)"
				borderRadius="10px"
				fontWeight="bold"
				h="350px"
			>
				<Text mt={2} mb={3} fontWeight="bold">
					Contacts Added
				</Text>
				<Box overflow="auto" h="85%">
					<Table size="sm" color={"brand.nav_color"} bg={"brand.primary_bg"}>
						<Thead>
							<Tr>
								<Th p={0}>#ID</Th>
								<Th> Name</Th>
								<Th>Email</Th>
								<Th></Th>
							</Tr>
						</Thead>
						<Tbody border={"none"} color={"brand.nav_color"}>
							{agents?.map(({ _id, fullName, email }, index) => (
								<Tr key={_id}>
									<Td fontSize={"xs"} p={0}>
										#{index + 1}
									</Td>
									<Td fontSize={"xs"} border={"none"} py={0}>
										<Flex align="center">
											<Avatar
												size="sm"
												src=""
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
											_hover={{ bg: "#8385d5", color: "brand.100" }}
										/>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</Box>
			</Box>
		</SimpleGrid>
	);
};

export default Meetings;
