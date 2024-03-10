import { ArrowUpIcon, CopyIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Card,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Icon,
	IconButton,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Select,
	SimpleGrid,
	Stack,
	Text,
	VStack,
	useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { RiEditLine } from "react-icons/ri";
import LeadsService from "services/LeadsService";
import { generateRandomData } from "utils";
import { TARGET_LEADS } from "../opportunities/data";
import GradientAreaFillColorChart from "./AreaFillColorChart";

const Pipeline = () => {
	const [leads, setLeads] = useState(null);

	const fetchAllLeads = async () => {
		try {
			const response = await LeadsService.getConfirmedDisbursedLeads();
			setLeads(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchAllLeads();
	}, []);

	const { isOpen, onOpen, onClose } = useDisclosure();
	const handleSubmit = () => console.log("submit");

	// const opportunityData = [
	// 	{ name: "Meeting Set", value: 100 },
	// 	{ name: "Meeting Set", value: 250 },
	// 	{ name: "Meeting Set", value: 550 },
	// 	{ name: "Meeting Set", value: 350 },
	// 	{ name: "Meeting Set", value: 100 },
	// 	{ name: "Discovery Call", value: 150 },
	// 	{ name: "Discovery Call", value: 250 },
	// 	{ name: "Discovery Call", value: 550 },
	// 	{ name: "Discovery Call", value: 300 },
	// 	{ name: "Discovery Call", value: 100 },
	// 	{ name: "Onboard", value: 100 },
	// 	{ name: "Onboard", value: 250 },
	// 	{ name: "Onboard", value: 550 },
	// 	{ name: "Onboard", value: 300 },
	// 	{ name: "Onboard", value: 200 },
	// 	{ name: "Closing", value: 100 },
	// 	{ name: "Closing", value: 250 },
	// 	{ name: "Closing", value: 550 },
	// 	{ name: "Closing", value: 300 },
	// ];

	const meetingSetData = generateRandomData("Meeting Set", 5);
	const discoveryCallData = generateRandomData("Discovery Call", 5);
	const onboardData = generateRandomData("Onboard", 5);
	const closingData = generateRandomData("Closing", 5);

	// const opportunityData = [
	// 	...meetingSetData,
	// 	...discoveryCallData,
	// 	...onboardData,
	// 	...closingData,
	// ];

	const opportunityData = [
		{ name: "Closing", value: 0 },
		{ name: "Closing", value: 0 },
		{ name: "Closing", value: 0 },
		{ name: "Closing", value: 0 },
	];
	const totalLeads = (name) =>
		leads.filter((lead) => lead.stage === name).length;

	return (
		<Box p={{ base: "1em", md: "2em" }}>
			<Text fontWeight="bold" mb={"0.5em"}>
				Target Leads
			</Text>
			<Box
				width="100%"
				borderRadius="10px"
				border="3px solid var(--main_color)"
			>
				<Text p={"1em"} fontWeight="bold" color={"brand.200"} mb={"0.5em"}>
					Pipeline
				</Text>
				{opportunityData && (
					<GradientAreaFillColorChart opportunityData={opportunityData} />
				)}
			</Box>
			<SimpleGrid
				columns={{ base: 1, md: 2, lg: 4 }}
				spacing="1em"
				color={"brand.200"}
			>
				{leads &&
					TARGET_LEADS.map((category) => (
						<Box
							borderRadius="10px"
							border="3px solid var(--main_color)"
							key={category.id}
						>
							<Box
								fontWeight="bold"
								px="1em"
								bg={category.color}
								borderTopLeftRadius="10px"
								borderTopRightRadius="10px"
							>
								<Flex justify="space-between" align="center">
									<Text fontSize="xs" fontWeight="bold">
										{category.name}
									</Text>
									<Select width="90px" border={"none"} fontSize={"xs"}>
										<option>Weekly</option>
										<option>Last month</option>
									</Select>
								</Flex>
								<Flex align="center" color={"brand.600"} pb="1">
									<Text mr="3">{totalLeads(category.abbr)}</Text>
									<Icon mr="1" as={ArrowUpIcon} color="green.500" />
									<Text color="green.500" fontSize="xs">
										10%
									</Text>
								</Flex>
							</Box>
							{leads.map(({ _id, opportunityName, email, phone, stage }) => {
								return category.abbr === stage ? (
									<Card
										key={_id}
										m="1em"
										bg={category.color}
										border={"1px solid var(--lead_cards_border)"}
									>
										<VStack
											align="flex-start"
											color={"brand.200"}
											fontSize="xs"
											p={"1em"}
											spacing={0.5}
										>
											<HStack justifyContent={"space-between"} w={"100%"}>
												<Text fontSize="xs" fontWeight="bold">
													Name of Company
												</Text>
												<RiEditLine onClick={onOpen} />
											</HStack>
											<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
												{opportunityName}
											</Text>
											<Text fontSize="xs" fontWeight="bold">
												Email
											</Text>
											<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
												{email}
												<IconButton
													icon={<CopyIcon />}
													size={"xs"}
													color="brand.600"
												/>
											</Text>
											<Text fontSize="xs" fontWeight="bold">
												Phone
											</Text>
											<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
												{phone}
											</Text>
										</VStack>
									</Card>
								) : (
									<></>
								);
							})}
						</Box>
					))}
			</SimpleGrid>
			<Modal isCentered isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Edit Lead</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Stack spacing="5">
							<form onSubmit={handleSubmit}>
								<Stack spacing={4}>
									<FormControl>
										<FormLabel>Name of Company</FormLabel>
										<Input
											type="text"
											name="company"
											// value={formData.email}
											// onChange={handleChange}
											required
										/>
									</FormControl>
									<FormControl>
										<FormLabel>Email</FormLabel>
										<Input
											type="email"
											name="email"
											// value={formData.email}
											// onChange={handleChange}
											required
										/>
									</FormControl>
									<FormControl>
										<FormLabel>Phone</FormLabel>
										<Input
											type="text"
											name="phone"
											// value={formData.email}
											// onChange={handleChange}
											required
										/>
									</FormControl>
									<HStack justifyContent={"end"}>
										<Button
											// isLoading={isLoading}
											type="submit"
											bg="brand.logo_bg"
											// _hover={{ color: "brand.100" }}
										>
											Save
										</Button>
										<Button
											// isLoading={isLoading}
											colorScheme="gray"
										>
											Cancel
										</Button>
									</HStack>
								</Stack>
							</form>
							{/* {error && (
						<Alert status="error" mt={4}>
							<AlertIcon />
							{error}
						</Alert>
					)} */}
						</Stack>
					</ModalBody>
				</ModalContent>
			</Modal>
			{/* )} */}
		</Box>
	);
};

export default Pipeline;
