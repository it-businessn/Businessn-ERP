import {
	Box,
	Button,
	Flex,
	HStack,
	Icon,
	Progress,
	SimpleGrid,
	Text,
	VStack,
} from "@chakra-ui/react";
import RightIconButton from "components/ui/button/RightIconButton";
import { ACTIVITY_CARDS, barOptions } from "constant";
import { useState } from "react";
import { RiAspectRatioLine } from "react-icons/ri";
import { useBreakpointValue } from "services/Breakpoint";
import { generateLighterShade } from "utils";
import GaugeChartComponent from "./GaugeChart";
import HorizontalBarChart from "./Horizontal";

const Activities = () => {
	const { isMobile, isIpad } = useBreakpointValue();

	// const [contacts, setContacts] = useState(null);
	// const fetchAllContacts = async () => {
	// 	try {
	// 		const response = await ActivityService.getContacts();
	// 		response.data.map((item) => (item.comm = "Meeting"));
	// 		setContacts(response.data);
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// };
	// useEffect(() => {
	// 	fetchAllContacts();
	// }, []);
	const [selectedFilter, setSelectedFilter] = useState("monthly");

	const handleFilterClick = (filter) => {
		setSelectedFilter(filter);
	};
	return (
		<Box p={{ base: "1em", md: "2em" }}>
			<Text fontWeight="bold">Activities</Text>
			{isMobile || isIpad ? (
				<SimpleGrid
					columns={{ base: 3, md: 5 }}
					spacing="1em"
					my="5"
					bg={"brand.100"}
					borderRadius={"20px"}
					p={"8px"}
				>
					{["Daily", "Weekly", "Monthly", "Quarterly", "Annual"].map((name) => (
						<Button
							key={name}
							borderRadius={selectedFilter === name ? "50px" : 0}
							border={selectedFilter === name ? "1px" : "none"}
							p={"1em"}
							color={selectedFilter === name ? "#517ae8" : "#676e78"}
							bgColor={
								selectedFilter === name && generateLighterShade("#517ae8", 0.8)
							}
							onClick={() => handleFilterClick(name)}
							variant={"outline"}
							size="xs"
						>
							{name}
						</Button>
					))}
				</SimpleGrid>
			) : (
				<SimpleGrid columns={{ base: 5, lg: 2 }} spacing="1em" my="5">
					<Flex gap="2em" bg={"brand.100"} borderRadius={"20px"} p={"8px"}>
						{["Daily", "Weekly", "Monthly", "Quarterly", "Annual"].map(
							(name) => (
								<Button
									key={name}
									borderRadius={selectedFilter === name ? "50px" : 0}
									border={selectedFilter === name ? "1px" : "none"}
									p={"1em"}
									color={selectedFilter === name ? "#517ae8" : "#676e78"}
									bgColor={
										selectedFilter === name &&
										generateLighterShade("#517ae8", 0.8)
									}
									onClick={() => handleFilterClick(name)}
									variant={"outline"}
									size="xs"
								>
									{name}
								</Button>
							),
						)}
					</Flex>
				</SimpleGrid>
			)}
			<SimpleGrid
				columns={{ lg: 2 }}
				spacing={4}
				templateColumns={{ lg: "35% 65%" }}
			>
				<SimpleGrid
					columns={1}
					spacing={4}
					templateRows={{ lg: "13% 13% 13% 13% 13%" }}
				>
					{ACTIVITY_CARDS.map((activity) => (
						<Box
							key={activity.title}
							p="1em"
							bg={"brand.primary_bg"}
							border="3px solid var(--main_color)"
							borderRadius="10px"
							fontWeight="bold"
							justifyContent="space-between"
							display="flex"
							flexDir={"column"}
						>
							<VStack alignItems="self-start" spacing={0}>
								<Icon as={activity.icon} color={activity.color} boxSize={10} />
								<Text fontWeight="bold">{activity.title}</Text>
							</VStack>
							<Box
								my={0}
								mx={"auto"}
								w={{ base: "50%", md: "40%", lg: "40%", xl: "40%" }}
							>
								<HorizontalBarChart
									data={activity.count}
									options={barOptions}
								/>
							</Box>

							<Flex borderTop="2px solid #e8ebf4" gap={0}>
								<Button
									variant="solid"
									bgGradient="linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)"
									bgClip="text"
									size={"xxs"}
									_hover={{
										bgGradient:
											"linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)",
										bgClip: "text",
									}}
								>
									{activity.action}
									<RightIconButton />
								</Button>
							</Flex>
						</Box>
					))}
				</SimpleGrid>
				<SimpleGrid
					columns={1}
					spacing={4}
					templateRows={{ md: "13% auto auto" }}
				>
					<Box
						p="1em"
						alignItems="center"
						display={"flex"}
						bg={"brand.primary_bg"}
						border="3px solid var(--main_color)"
						borderRadius="10px"
					>
						<GaugeChartComponent value={70} maxValue={100} />
					</Box>
					{["Contests For Sales", "Contests For Activity"].map((item) => (
						<Box
							key={item}
							p="1em"
							bg={"brand.primary_bg"}
							border="3px solid var(--main_color)"
							borderRadius="10px"
						>
							<Text fontWeight="bold">{item}</Text>
							<SimpleGrid columns={{ md: 3 }} spacing={4}>
								{["Sale 1", "Sale 2", "Sale 3"].map((item) => (
									<Box
										key={item}
										p="1em"
										bg={"brand.primary_bg"}
										border="3px solid var(--main_color)"
										borderRadius="10px"
										fontWeight="bold"
									>
										<HStack alignItems="self-start" spacing={2}>
											<Icon
												as={RiAspectRatioLine}
												color="orange"
												boxSize={10}
											/>
											<VStack spacing={0} alignItems={"start"}>
												<Text fontWeight="bold">{item}</Text>
												<Text fontSize="xs" p={0}>
													1st place
												</Text>
											</VStack>
										</HStack>
										<Box>
											<Text
												mt={"2em"}
												fontSize={"xs"}
												display={"flex"}
												justifyContent={"end"}
											>
												$5460
											</Text>
											<Progress
												colorScheme="green"
												size="sm"
												bg={"var(--main_color)"}
												value={50}
											/>
											<Flex mt={"2em"} borderTop="2px solid #e8ebf4">
												<Button
													bgGradient="linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)"
													bgClip="text"
													size={"xxs"}
												>
													More details
													<RightIconButton />
												</Button>
											</Flex>
										</Box>
									</Box>
								))}
							</SimpleGrid>
							<Box
								mt={"1em"}
								p="1em"
								bg={"brand.primary_bg"}
								border="3px solid var(--main_color)"
								borderRadius="10px"
								fontWeight="bold"
							>
								<HStack alignItems="self-start" spacing={2}>
									<Icon as={RiAspectRatioLine} color="orange" boxSize={10} />
									<VStack spacing={0} alignItems={"start"}>
										<Text fontWeight="bold">Sale 4</Text>
										<Text fontSize="xs" p={0}>
											1st Place
										</Text>
									</VStack>
								</HStack>
								<Box>
									<Text
										mt={"2em"}
										fontSize={"xs"}
										display={"flex"}
										justifyContent={"end"}
									>
										$5460
									</Text>
									<Progress
										colorScheme="green"
										size="sm"
										bg={"var(--main_color)"}
										value={50}
									/>
									<Flex mt={"2em"} borderTop="2px solid #e8ebf4">
										<Button
											bgGradient="linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)"
											bgClip="text"
											size={"xxs"}
										>
											More details
											<RightIconButton />
										</Button>
									</Flex>
								</Box>
							</Box>
							<Box
								mt={"1em"}
								p="1em"
								bg={"brand.primary_bg"}
								border="3px solid var(--main_color)"
								borderRadius="10px"
								fontWeight="bold"
							>
								<HStack alignItems="self-start" spacing={2}>
									<Icon as={RiAspectRatioLine} color="orange" boxSize={10} />
									<VStack spacing={0} alignItems={"start"}>
										<Text fontWeight="bold">Sale 5</Text>
										<Text fontSize="xs" p={0}>
											1st Place
										</Text>
									</VStack>
								</HStack>
								<Box>
									<Text
										mt={"2em"}
										fontSize={"xs"}
										display={"flex"}
										justifyContent={"end"}
									>
										$5460
									</Text>
									<Progress
										colorScheme="green"
										size="sm"
										bg={"var(--main_color)"}
										value={50}
									/>
									<Flex mt={"2em"} borderTop="2px solid #e8ebf4">
										<Button
											bgGradient="linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)"
											bgClip="text"
											size={"xxs"}
										>
											More details
											<RightIconButton />
										</Button>
									</Flex>
								</Box>
							</Box>
						</Box>
					))}
				</SimpleGrid>
			</SimpleGrid>
		</Box>
	);
};

export default Activities;
