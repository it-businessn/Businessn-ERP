import {
	Badge,
	Box,
	Button,
	HStack,
	Heading,
	SimpleGrid,
	Text,
	VStack,
} from "@chakra-ui/react";
import { doughnutOptions, trainingChartData } from "constant";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import QuestionnaireService from "services/QuestionnaireService";
import ResourceService from "services/ResourceService";
import FileUploader from "./FileUploader";
import ResourceFile from "./ResourceFile";

const Resources = () => {
	const user = LocalStorageService.getItem("user");
	const isManager =
		user.fullName === "David Dehkurdi" && user.role === "Administrators";

	const [resources, setResources] = useState(null);
	const [newUpload, setNewUpload] = useState(null);
	const [selectedFilter, setSelectedFilter] = useState(null);
	const [assessments, setAssessments] = useState(null);

	useEffect(() => {
		const fetchAllAssessments = async () => {
			try {
				const response = await QuestionnaireService.getAssessmentByUserId(
					user._id,
				);
				// const response = await QuestionnaireService.updateAssessmentStatus(
				// 	{ empId: user._id },
				// 	user._id,
				// );
				setAssessments(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllAssessments();
	}, []);

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
	const navigate = useNavigate();
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
					<HStack>
						<Text flex={1} mb={"0.5em"} fontWeight="bold">
							Your Overall Results
						</Text>
						{isManager && (
							<Button
								flex={0.4}
								p={"5px"}
								fontSize="sm"
								variant={"link"}
								_hover={{ color: "brand.600" }}
								onClick={() => navigate("/sales/add-paper")}
							>
								Add Assessment Paper
							</Button>
						)}
					</HStack>

					<SimpleGrid
						columns={{ base: 1, md: 1, lg: 3, xl: 3 }}
						minH={{ base: "auto", md: "90%", lg: "auto" }}
						spacing={"1em"}
					>
						{assessments?.map((assessment) => (
							<Box
								key={assessment._id}
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
								<VStack align={"self-start"} spacing={1}>
									<Text
										color={"brand.nav_color"}
										fontSize="xs"
										fontWeight="bold"
									>
										Assessment 1
									</Text>
									<Text fontSize="xs" fontWeight="bold">
										{assessment.subject}
									</Text>
									<Badge bg="green" color="var(--main_color)">
										{assessment?.category
											? assessment.category.toUpperCase()
											: ""}
									</Badge>
									<Text
										color={"brand.nav_color"}
										fontSize="xs"
										fontWeight="bold"
									>
										Your result
									</Text>
									<Text fontWeight="bolder">{assessment.result}</Text>

									<Heading size={"sm"} color="transparent">
										ss
									</Heading>
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
										onClick={() => navigate("/sales/assessment")}
									>
										Re-Take Assessment
									</Button>
								</VStack>
							</Box>
						))}
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
							<VStack align={"self-start"} spacing={1}>
								<Text color={"brand.nav_color"} fontSize="xs" fontWeight="bold">
									Assessment 2
								</Text>
								<Text fontSize="xs" fontWeight="bold">
									Know the product a
								</Text>
								<Badge
									bg="green"
									color="var(--main_color)"
									visibility={"hidden"}
								>
									asd
								</Badge>
								<Text
									color={"brand.nav_color"}
									fontSize="xs"
									fontWeight="bold"
									visibility={"hidden"}
								>
									Your result
								</Text>
								<Text fontWeight="bolder" visibility={"hidden"}>
									0
								</Text>

								<Heading size={"sm"} color="transparent">
									ss
								</Heading>
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
									onClick={() => navigate("/sales/assessment")}
								>
									Take Assessment
								</Button>
							</VStack>
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
							<VStack align={"self-start"} spacing={1}>
								<Text color={"brand.nav_color"} fontSize="xs" fontWeight="bold">
									Assessment 3
								</Text>
								<Text fontSize="xs" fontWeight="bold">
									Know the product b
								</Text>
								<Badge
									bg="green"
									color="var(--main_color)"
									visibility={"hidden"}
								>
									asd
								</Badge>
								<Text
									color={"brand.nav_color"}
									fontSize="xs"
									fontWeight="bold"
									visibility={"hidden"}
								>
									Your result
								</Text>
								<Text fontWeight="bolder" visibility={"hidden"}>
									0
								</Text>

								<Heading size={"sm"} color="transparent">
									ss
								</Heading>
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
									onClick={() => navigate("/sales/assessment")}
								>
									Take Assessment
								</Button>
							</VStack>
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
