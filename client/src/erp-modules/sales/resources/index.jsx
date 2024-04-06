import {
	Badge,
	Box,
	Button,
	Heading,
	SimpleGrid,
	Text,
} from "@chakra-ui/react";
import { doughnutOptions, trainingChartData } from "constant";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import LocalStorageService from "services/LocalStorageService";
import ResourceService from "services/ResourceService";
import FileUploader from "./FileUploader";
import ResourceFile from "./ResourceFile";

const Resources = () => {
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
			} catch (error) {
				console.error(error);
			}
		};
		if (selectedFilter) {
			fetchResourceByType();
		}
	}, [selectedFilter]);

	const FILE_TYPES = [
		{ type: "Scripts" },
		{ type: "Product Knowledge" },
		{ type: "Employee Handbook" },
		{ type: "Associated" },
		{ type: "Training resources" },
	];

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
					border="3px solid var(--main_color)"
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
					border="3px solid var(--main_color)"
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
							border="3px solid var(--main_color)"
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
							<Badge bg="green" color="var(--main_color)">
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
							border="3px solid var(--main_color)"
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
								bg="var(--primary_button_bg)"
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
							border="3px solid var(--main_color)"
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
								bg="var(--primary_button_bg)"
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
					<ResourceFile
						fileTypes={FILE_TYPES}
						selectedFilter={selectedFilter}
						setSelectedFilter={setSelectedFilter}
						resources={resources}
						setNewUpload={setNewUpload}
					/>
				</SimpleGrid>
			) : (
				<ResourceFile
					fileTypes={FILE_TYPES}
					selectedFilter={selectedFilter}
					setSelectedFilter={setSelectedFilter}
					resources={resources}
					setNewUpload={setNewUpload}
				/>
			)}
		</Box>
	);
};

export default Resources;
