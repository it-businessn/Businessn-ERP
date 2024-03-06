import {
	Badge,
	Box,
	Button,
	Card,
	Flex,
	Heading,
	Icon,
	Image,
	SimpleGrid,
	Text,
	VStack,
} from "@chakra-ui/react";
import { doughnutOptions, trainingChartData } from "constant";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { FaDownload } from "react-icons/fa";
import { useBreakpointValue } from "services/Breakpoint";
import LocalStorageService from "services/LocalStorageService";
import ResourceService from "services/ResourceService";
import bookCover from "../../../assets/logos/BusinessN_all.jpg";
import FileUploader from "./FileUploader";

const Resources = () => {
	const { isMobile, isIpad } = useBreakpointValue();
	const user = LocalStorageService.getItem("user");

	const [resources, setResources] = useState(null);
	const [newUpload, setNewUpload] = useState(null);
	const [selectedFilter, setSelectedFilter] = useState(null);

	useEffect(() => {
		const fetchAllResources = async () => {
			try {
				const response = await ResourceService.getResources();
				setResources(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllResources();
	}, [newUpload]);

	useEffect(() => {
		const fetchResourceByType = async () => {
			try {
				const response = await ResourceService.getResourcesByType(
					selectedFilter,
				);

				setResources(response.data);
				console.log(resources);
			} catch (error) {
				console.error(error);
			}
		};
		if (selectedFilter) {
			fetchResourceByType();
		}
	}, [selectedFilter]);

	const handleFilterClick = (filter) => {
		setSelectedFilter(filter);
	};
	const FILE_TYPES = [
		{ type: "Scripts" },
		{ type: "Product Knowledge" },
		{ type: "Employee Handbook" },
		{ type: "Associated" },
		{ type: "Training resources" },
	];

	const handleDownload = (fileName) => {
		const downloadUrl = `http://localhost:5000/api/resources/download/${fileName}`;
		window.location.href = downloadUrl;
	};

	const showFiles = () => (
		<>
			<Flex justifyContent={"space-between"}>
				<VStack alignItems={"self-start"}>
					<Text mt={2} mb={5} fontWeight="bold">
						Browse by subject
					</Text>
					{isMobile || isIpad ? (
						<SimpleGrid columns={{ base: 2, md: 3 }} spacing="1em" my="5">
							{FILE_TYPES.map(({ type }) => (
								<Button
									key={type}
									borderRadius={"50px"}
									p={"1em"}
									color={selectedFilter === type ? "#4c67c3" : "#676e78"}
									onClick={() => handleFilterClick(type)}
									variant={"outline"}
									leftIcon={<Icon as={FaDownload} />}
									size="xs"
								>
									{type}
								</Button>
							))}
						</SimpleGrid>
					) : (
						<Flex gap="1em">
							{FILE_TYPES.map(({ type }) => (
								<Button
									key={type}
									borderRadius={"50px"}
									p={"1em"}
									color={selectedFilter === type ? "#4c67c3" : "#676e78"}
									onClick={() => handleFilterClick(type)}
									variant={"outline"}
									leftIcon={<Icon as={FaDownload} />}
									size="xs"
								>
									{type}
								</Button>
							))}
						</Flex>
					)}
				</VStack>
			</Flex>
			<SimpleGrid columns={{ base: 1, md: 3, lg: 5 }} spacing="1em" my="5">
				{resources?.map((resource) => (
					<Box
						key={resource._id}
						p="1em"
						bg={"brand.primary_bg"}
						border="3px solid white"
						borderRadius="10px"
					>
						<VStack spacing={"1em"}>
							<Card maxW="md" borderRadius="0" overflow="hidden">
								<Image src={bookCover} alt={"book.title"} />
							</Card>
							<Text fontSize={"sm"}>{resource.originalname}</Text>
							<Button
								onClick={() => handleDownload(resource.originalname)}
								w={"100%"}
								bg={"#537eee"}
								color={"brand.primary_bg"}
								variant={"solid"}
								_hover={{ color: "brand.600" }}
								borderRadius={"10px"}
								size="xs"
							>
								Download
							</Button>
						</VStack>
					</Box>
				))}
			</SimpleGrid>
		</>
	);

	return (
		<Box p={{ base: "1em", md: "2em" }} overflow={"auto"}>
			<Text fontWeight="bold" mb={"1em"}>
				Resources
			</Text>
			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="1em"
				mt={"0.5em"}
			>
				<Box
					px="1em"
					py="0.5em"
					bg={"brand.primary_bg"}
					border="3px solid white"
					borderRadius="10px"
					fontWeight="bold"
					color={"brand.nav_color"}
				>
					<Text fontWeight="bold">Training</Text>
					<Box w={{ base: "60%", md: "40%", lg: "60%", xl: "40%" }} mx={"auto"}>
						<Doughnut
							data={trainingChartData}
							options={doughnutOptions("40%")}
						/>
					</Box>
				</Box>
				<Box
					p="1em"
					pt={"0.5em"}
					border="3px solid white"
					borderRadius="10px"
					fontWeight="bold"
					color={"brand.nav_color"}
				>
					<Text mb={"0.5em"} fontWeight="bold">
						Your Overall Results
					</Text>
					<SimpleGrid
						columns={{ base: 1, md: 1, lg: 3, xl: 3 }}
						minH={{ base: "auto", md: "90%", lg: "auto" }}
						spacing={"1em"}
					>
						<Box
							p={{ base: "1em", lg: "1em 5px" }}
							my={"auto"}
							bg={"brand.primary_bg"}
							border="3px solid white"
							borderRadius="10px"
							fontWeight="bold"
							display="flex"
							flexDir="column"
							justifyContent="space-evenly"
							alignItems="flex-start"
						>
							<Text color={"brand.nav_color"} fontSize="xs" fontWeight="bold">
								Assessment 1
							</Text>
							<Text fontSize="xs" fontWeight="bold">
								Know your customer
							</Text>
							<Badge bg="green" color="white">
								EXCELLENT
							</Badge>
							<Text color={"brand.nav_color"} fontSize="xs" fontWeight="bold">
								Your result
							</Text>
							<Text fontWeight="bolder">8/10</Text>
						</Box>
						<Box
							p={{ base: "1em", lg: "1em 5px" }}
							h={{ base: "auto" }}
							my={"auto"}
							bg={"brand.primary_bg"}
							border="3px solid white"
							borderRadius="10px"
							fontWeight="bold"
							display="flex"
							flexDir="column"
							justifyContent="space-evenly"
							alignItems="flex-start"
						>
							<Text color={"brand.nav_color"} fontSize="xs" fontWeight="bold">
								Assessment 2
							</Text>
							<Text fontSize="xs" fontWeight="bold">
								Know the product a
							</Text>
							<Heading></Heading>
							<Heading></Heading>
							<Heading color="transparent">ss</Heading>
							<Button
								w={"100%"}
								p={"5px 0"}
								bg={"#537eee"}
								h={"3em"}
								fontSize="10px"
								color={"brand.primary_bg"}
								variant={"solid"}
								_hover={{ color: "brand.600" }}
								borderRadius={"10px"}
							>
								Take Assessment
							</Button>
						</Box>
						<Box
							p={{ base: "1em", lg: "1em 5px" }}
							my={"auto"}
							bg={"brand.primary_bg"}
							border="3px solid white"
							borderRadius="10px"
							fontWeight="bold"
							display="flex"
							flexDir="column"
							justifyContent="space-evenly"
							alignItems="flex-start"
						>
							<Text color={"brand.nav_color"} fontSize="xs" fontWeight="bold">
								Assessment 3
							</Text>
							<Text fontSize="xs" fontWeight="bold">
								Know the product b
							</Text>
							<Heading></Heading>
							<Heading></Heading>
							<Heading color="transparent">ss</Heading>
							<Button
								w={"100%"}
								bg={"#537eee"}
								p={"5px 0"}
								h={"3em"}
								fontSize="10px"
								color={"brand.primary_bg"}
								variant={"solid"}
								_hover={{ color: "brand.600" }}
								borderRadius={"10px"}
							>
								Take Assessment
							</Button>
						</Box>
					</SimpleGrid>
				</Box>
			</SimpleGrid>
			{user && user.role !== "Employee" ? (
				<SimpleGrid columns={{ base: 1, md: 1, lg: 1 }}>
					<FileUploader
						setNewUpload={setNewUpload}
						fileTypes={FILE_TYPES}
						userName={user.fullName}
					/>
					{showFiles()}
				</SimpleGrid>
			) : (
				showFiles()
			)}
		</Box>
	);
};

export default Resources;
