import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Flex,
	HStack,
	Icon,
	IconButton,
	Progress,
	SimpleGrid,
	Text,
	VStack,
} from "@chakra-ui/react";
import { ACTIVITY_CARDS, barOptions } from "constant";
import { useState } from "react";
import { RiAspectRatioLine } from "react-icons/ri";
import { useBreakpointValue } from "services/Breakpoint";
import { generateLighterShade } from "utils";
import GaugeChartComponent from "./GaugeChartC";
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
					<Button
						borderRadius={selectedFilter === "daily" ? "50px" : 0}
						border={selectedFilter === "daily" ? "1px" : "none"}
						p={"1em"}
						color={selectedFilter === "daily" ? "#517ae8" : "#676e78"}
						bgColor={
							selectedFilter === "daily" && generateLighterShade("#517ae8", 0.8)
						}
						onClick={() => handleFilterClick("daily")}
						variant={"outline"}
						size="xs"
					>
						Daily
					</Button>

					<Button
						borderRadius={selectedFilter === "weekly" ? "50px" : 0}
						border={selectedFilter === "weekly" ? "1px" : "none"}
						p={"1em"}
						color={selectedFilter === "weekly" ? "#517ae8" : "#676e78"}
						bgColor={
							selectedFilter === "weekly" &&
							generateLighterShade("#517ae8", 0.8)
						}
						onClick={() => handleFilterClick("weekly")}
						variant={"outline"}
						size="xs"
					>
						Weekly
					</Button>
					<Button
						borderRadius={selectedFilter === "monthly" ? "50px" : 0}
						border={selectedFilter === "monthly" ? "1px" : "none"}
						p={"1em"}
						color={selectedFilter === "monthly" ? "#517ae8" : "#676e78"}
						bgColor={
							selectedFilter === "monthly" &&
							generateLighterShade("#517ae8", 0.8)
						}
						onClick={() => handleFilterClick("monthly")}
						variant={"outline"}
						size="xs"
					>
						Monthly
					</Button>
					<Button
						borderRadius={selectedFilter === "quarterly" ? "50px" : 0}
						border={selectedFilter === "quarterly" ? "1px" : "none"}
						p={"1em"}
						color={selectedFilter === "quarterly" ? "#517ae8" : "#676e78"}
						bgColor={
							selectedFilter === "quarterly" &&
							generateLighterShade("#517ae8", 0.8)
						}
						onClick={() => handleFilterClick("quarterly")}
						variant={"outline"}
						size="xs"
					>
						Quarterly
					</Button>
					<Button
						borderRadius={selectedFilter === "annual" ? "50px" : 0}
						border={selectedFilter === "annual" ? "1px" : "none"}
						p={"1em"}
						color={selectedFilter === "annual" ? "#517ae8" : "#676e78"}
						bgColor={
							selectedFilter === "annual" &&
							generateLighterShade("#517ae8", 0.8)
						}
						onClick={() => handleFilterClick("annual")}
						variant={"outline"}
						size="xs"
					>
						Annual
					</Button>
				</SimpleGrid>
			) : (
				<SimpleGrid columns={{ base: 5, lg: 2 }} spacing="1em" my="5">
					<Flex gap="2em" bg={"brand.100"} borderRadius={"20px"} p={"8px"}>
						<Button
							borderRadius={selectedFilter === "daily" ? "50px" : 0}
							border={selectedFilter === "daily" ? "1px" : "none"}
							p={"1em"}
							color={selectedFilter === "daily" ? "#517ae8" : "#676e78"}
							bgColor={
								selectedFilter === "daily" &&
								generateLighterShade("#517ae8", 0.8)
							}
							onClick={() => handleFilterClick("daily")}
							variant={"outline"}
							size="xs"
						>
							Daily
						</Button>

						<Button
							borderRadius={selectedFilter === "weekly" ? "50px" : 0}
							border={selectedFilter === "weekly" ? "1px" : "none"}
							p={"1em"}
							color={selectedFilter === "weekly" ? "#517ae8" : "#676e78"}
							bgColor={
								selectedFilter === "weekly" &&
								generateLighterShade("#517ae8", 0.8)
							}
							onClick={() => handleFilterClick("weekly")}
							variant={"outline"}
							size="xs"
						>
							Weekly
						</Button>
						<Button
							borderRadius={selectedFilter === "monthly" ? "50px" : 0}
							border={selectedFilter === "monthly" ? "1px" : "none"}
							p={"1em"}
							color={selectedFilter === "monthly" ? "#517ae8" : "#676e78"}
							bgColor={
								selectedFilter === "monthly" &&
								generateLighterShade("#517ae8", 0.8)
							}
							onClick={() => handleFilterClick("monthly")}
							variant={"outline"}
							size="xs"
						>
							Monthly
						</Button>
						<Button
							borderRadius={selectedFilter === "quarterly" ? "50px" : 0}
							border={selectedFilter === "quarterly" ? "1px" : "none"}
							p={"1em"}
							color={selectedFilter === "quarterly" ? "#517ae8" : "#676e78"}
							bgColor={
								selectedFilter === "quarterly" &&
								generateLighterShade("#517ae8", 0.8)
							}
							onClick={() => handleFilterClick("quarterly")}
							variant={"outline"}
							size="xs"
						>
							Quarterly
						</Button>
						<Button
							borderRadius={selectedFilter === "annual" ? "50px" : 0}
							border={selectedFilter === "annual" ? "1px" : "none"}
							p={"1em"}
							color={selectedFilter === "annual" ? "#517ae8" : "#676e78"}
							bgColor={
								selectedFilter === "annual" &&
								generateLighterShade("#517ae8", 0.8)
							}
							onClick={() => handleFilterClick("annual")}
							variant={"outline"}
							size="xs"
						>
							Annual
						</Button>
					</Flex>
				</SimpleGrid>
			)}
			<SimpleGrid
				columns={{ lg: 2 }}
				spacing={4}
				templateColumns={{ lg: "35% 65%" }}
			>
				<SimpleGrid columns={1} spacing={4}>
					{ACTIVITY_CARDS.map((activity) => (
						<Box
							p="1em"
							bg={"brand.primary_bg"}
							border="3px solid white"
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
								mx={"auto"}
								h={{ base: "50%", md: "40%", lg: "80%", xl: "50%" }}
								w={{ base: "50%", md: "40%", lg: "80%", xl: "50%" }}
							>
								<HorizontalBarChart
									data={activity.count}
									options={barOptions}
								/>
							</Box>

							<Flex borderTop="2px solid #e8ebf4">
								<Button
									bgGradient="linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)"
									bgClip="text"
									size={"xxs"}
									rightIcon={
										<IconButton
											icon={<ArrowForwardIcon />}
											color="purple.500"
											p={"0.4em"}
											size={"xxs"}
											_hover={{ bg: "#8385d5", color: "brand.100" }}
										/>
									}
								>
									{activity.action}
								</Button>
							</Flex>
						</Box>
					))}
				</SimpleGrid>

				<SimpleGrid
					columns={1}
					spacing={4}
					templateRows={{ md: "15% auto auto" }}
				>
					<Box
						p="1em"
						alignItems="center"
						display={"flex"}
						bg={"brand.primary_bg"}
						border="3px solid white"
						borderRadius="10px"
					>
						<GaugeChartComponent value={70} maxValue={100} />
					</Box>
					<Box
						p="1em"
						bg={"brand.primary_bg"}
						border="3px solid white"
						borderRadius="10px"
					>
						<Text fontWeight="bold">Contests For Sales</Text>
						<SimpleGrid columns={{ md: 3 }} spacing={4}>
							<Box
								p="1em"
								bg={"brand.primary_bg"}
								border="3px solid white"
								borderRadius="10px"
								fontWeight="bold"
							>
								<HStack alignItems="self-start" spacing={2}>
									<Icon as={RiAspectRatioLine} color="orange" boxSize={10} />
									<VStack spacing={0} alignItems={"start"}>
										<Text fontWeight="bold">Sale 1</Text>
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
										bg={"white"}
										value={50}
									/>
									<Flex mt={"2em"} borderTop="2px solid #e8ebf4">
										<Button
											bgGradient="linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)"
											bgClip="text"
											size={"xxs"}
											rightIcon={
												<IconButton
													icon={<ArrowForwardIcon />}
													color="purple.500"
													p={"0.4em"}
													size={"xxs"}
													_hover={{ bg: "#8385d5", color: "brand.100" }}
												/>
											}
										>
											More details
										</Button>
									</Flex>
								</Box>
							</Box>
							<Box
								p="1em"
								bg={"brand.primary_bg"}
								border="3px solid white"
								borderRadius="10px"
								fontWeight="bold"
							>
								<HStack alignItems="self-start" spacing={2}>
									<Icon as={RiAspectRatioLine} color="orange" boxSize={10} />
									<VStack spacing={0} alignItems={"start"}>
										<Text fontWeight="bold">Sale 2</Text>
										<Text fontSize="xs" p={0}>
											2nd place
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
										bg={"white"}
										value={50}
									/>
									<Flex mt={"2em"} borderTop="2px solid #e8ebf4">
										<Button
											bgGradient="linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)"
											bgClip="text"
											size={"xxs"}
											rightIcon={
												<IconButton
													icon={<ArrowForwardIcon />}
													color="purple.500"
													p={"0.4em"}
													size={"xxs"}
													_hover={{ bg: "#8385d5", color: "brand.100" }}
												/>
											}
										>
											More details
										</Button>
									</Flex>
								</Box>
							</Box>
							<Box
								p="1em"
								bg={"brand.primary_bg"}
								border="3px solid white"
								borderRadius="10px"
								fontWeight="bold"
							>
								<HStack alignItems="self-start" spacing={2}>
									<Icon as={RiAspectRatioLine} color="orange" boxSize={10} />
									<VStack spacing={0} alignItems={"start"}>
										<Text fontWeight="bold">Sale 3</Text>
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
										bg={"white"}
										value={50}
									/>
									<Flex mt={"2em"} borderTop="2px solid #e8ebf4">
										<Button
											bgGradient="linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)"
											bgClip="text"
											size={"xxs"}
											rightIcon={
												<IconButton
													icon={<ArrowForwardIcon />}
													color="purple.500"
													p={"0.4em"}
													size={"xxs"}
													_hover={{ bg: "#8385d5", color: "brand.100" }}
												/>
											}
										>
											More details
										</Button>
									</Flex>
								</Box>
							</Box>
						</SimpleGrid>
						<Box
							my={"1em"}
							p="1em"
							bg={"brand.primary_bg"}
							border="3px solid white"
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
									bg={"white"}
									value={50}
								/>
								<Flex mt={"2em"} borderTop="2px solid #e8ebf4">
									<Button
										bgGradient="linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)"
										bgClip="text"
										size={"xxs"}
										rightIcon={
											<IconButton
												icon={<ArrowForwardIcon />}
												color="purple.500"
												p={"0.4em"}
												size={"xxs"}
												_hover={{ bg: "#8385d5", color: "brand.100" }}
											/>
										}
									>
										More details
									</Button>
								</Flex>
							</Box>
						</Box>
						<Box
							my={"1em"}
							p="1em"
							bg={"brand.primary_bg"}
							border="3px solid white"
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
									bg={"white"}
									value={50}
								/>
								<Flex mt={"2em"} borderTop="2px solid #e8ebf4">
									<Button
										bgGradient="linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)"
										bgClip="text"
										size={"xxs"}
										rightIcon={
											<IconButton
												icon={<ArrowForwardIcon />}
												color="purple.500"
												p={"0.4em"}
												size={"xxs"}
												_hover={{ bg: "#8385d5", color: "brand.100" }}
											/>
										}
									>
										More details
									</Button>
								</Flex>
							</Box>
						</Box>
					</Box>
					<Box
						p="1em"
						bg={"brand.primary_bg"}
						border="3px solid white"
						borderRadius="10px"
					>
						<Text fontWeight="bold">Contests For Activity</Text>
						<SimpleGrid columns={{ md: 3 }} spacing={4}>
							<Box
								p="1em"
								bg={"brand.primary_bg"}
								border="3px solid white"
								borderRadius="10px"
								fontWeight="bold"
							>
								<HStack alignItems="self-start" spacing={2}>
									<Icon as={RiAspectRatioLine} color="orange" boxSize={10} />
									<VStack spacing={0} alignItems={"start"}>
										<Text fontWeight="bold">Emails Sent</Text>
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
										450
									</Text>
									<Progress
										colorScheme="green"
										size="sm"
										bg={"white"}
										value={50}
									/>
									<Flex mt={"2em"} borderTop="2px solid #e8ebf4">
										<Button
											bgGradient="linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)"
											bgClip="text"
											size={"xxs"}
											rightIcon={
												<IconButton
													icon={<ArrowForwardIcon />}
													color="purple.500"
													p={"0.4em"}
													size={"xxs"}
													_hover={{ bg: "#8385d5", color: "brand.100" }}
												/>
											}
										>
											More details
										</Button>
									</Flex>
								</Box>
							</Box>
							<Box
								p="1em"
								bg={"brand.primary_bg"}
								border="3px solid white"
								borderRadius="10px"
								fontWeight="bold"
							>
								<HStack alignItems="self-start" spacing={2}>
									<Icon as={RiAspectRatioLine} color="orange" boxSize={10} />
									<VStack spacing={0} alignItems={"start"}>
										<Text fontWeight="bold">Contacts</Text>
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
										340
									</Text>
									<Progress
										colorScheme="green"
										size="sm"
										bg={"white"}
										value={50}
									/>
									<Flex mt={"2em"} borderTop="2px solid #e8ebf4">
										<Button
											bgGradient="linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)"
											bgClip="text"
											size={"xxs"}
											rightIcon={
												<IconButton
													icon={<ArrowForwardIcon />}
													color="purple.500"
													p={"0.4em"}
													size={"xxs"}
													_hover={{ bg: "#8385d5", color: "brand.100" }}
												/>
											}
										>
											More details
										</Button>
									</Flex>
								</Box>
							</Box>
							<Box
								p="1em"
								bg={"brand.primary_bg"}
								border="3px solid white"
								borderRadius="10px"
								fontWeight="bold"
							>
								<HStack alignItems="self-start" spacing={2}>
									<Icon as={RiAspectRatioLine} color="orange" boxSize={10} />
									<VStack spacing={0} alignItems={"start"}>
										<Text fontWeight="bold">Calls Made</Text>
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
										250
									</Text>
									<Progress
										colorScheme="green"
										size="sm"
										bg={"white"}
										value={50}
									/>
									<Flex mt={"2em"} borderTop="2px solid #e8ebf4">
										<Button
											bgGradient="linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)"
											bgClip="text"
											size={"xxs"}
											rightIcon={
												<IconButton
													icon={<ArrowForwardIcon />}
													color="purple.500"
													p={"0.4em"}
													size={"xxs"}
													_hover={{ bg: "#8385d5", color: "brand.100" }}
												/>
											}
										>
											More details
										</Button>
									</Flex>
								</Box>
							</Box>
						</SimpleGrid>
						<Box
							my={"1em"}
							p="1em"
							bg={"brand.primary_bg"}
							border="3px solid white"
							borderRadius="10px"
							fontWeight="bold"
						>
							<HStack alignItems="self-start" spacing={2}>
								<Icon as={RiAspectRatioLine} color="orange" boxSize={10} />
								<VStack spacing={0} alignItems={"start"}>
									<Text fontWeight="bold">Meetings</Text>
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
									160
								</Text>
								<Progress
									colorScheme="green"
									size="sm"
									bg={"white"}
									value={50}
								/>
								<Flex mt={"2em"} borderTop="2px solid #e8ebf4">
									<Button
										bgGradient="linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)"
										bgClip="text"
										size={"xxs"}
										rightIcon={
											<IconButton
												icon={<ArrowForwardIcon />}
												color="purple.500"
												p={"0.4em"}
												size={"xxs"}
												_hover={{ bg: "#8385d5", color: "brand.100" }}
											/>
										}
									>
										More details
									</Button>
								</Flex>
							</Box>
						</Box>
						<Box
							my={"1em"}
							p="1em"
							bg={"brand.primary_bg"}
							border="3px solid white"
							borderRadius="10px"
							fontWeight="bold"
						>
							<HStack alignItems="self-start" spacing={2}>
								<Icon as={RiAspectRatioLine} color="orange" boxSize={10} />
								<VStack spacing={0} alignItems={"start"}>
									<Text fontWeight="bold">Sales Target</Text>
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
									$5,5k
								</Text>
								<Progress
									colorScheme="green"
									size="sm"
									bg={"white"}
									value={50}
								/>
								<Flex mt={"2em"} borderTop="2px solid #e8ebf4">
									<Button
										bgGradient="linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)"
										bgClip="text"
										size={"xxs"}
										rightIcon={
											<IconButton
												icon={<ArrowForwardIcon />}
												color="purple.500"
												p={"0.4em"}
												size={"xxs"}
												_hover={{ bg: "#8385d5", color: "brand.100" }}
											/>
										}
									>
										More details
									</Button>
								</Flex>
							</Box>
						</Box>
					</Box>
				</SimpleGrid>
			</SimpleGrid>
		</Box>
	);
};

export default Activities;
