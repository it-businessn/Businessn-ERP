import {
	Badge,
	Box,
	Button,
	HStack,
	SimpleGrid,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import QuestionnaireService from "services/QuestionnaireService";

const AssociateViewCard = () => {
	const [assessments, setAssessments] = useState(null);
	const [assessmentsTaken, setAssessmentsTaken] = useState(null);

	const user = LocalStorageService.getItem("user");
	useEffect(() => {
		const fetchAllAssessmentTypes = async () => {
			try {
				const response = await QuestionnaireService.getAssessmentTypes();
				setAssessments(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllAssessmentTypes();
		const fetchAssessmentsTaken = async () => {
			try {
				const response = await QuestionnaireService.getAssessmentByUserId(
					user._id,
				);
				setAssessmentsTaken(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAssessmentsTaken();
	}, []);
	const navigate = useNavigate();
	return (
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
			</HStack>

			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 3, xl: 3 }}
				minH={{ base: "auto", md: "90%", lg: "auto" }}
				spacing={"1em"}
			>
				{assessments?.map((assessment) => {
					const assessmentResult = assessmentsTaken?.find(
						(type) => type.subject === assessment.name,
					);

					return (
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
							<VStack align={"self-start"} spacing={2} w={"100%"}>
								<Text color={"brand.nav_color"} fontSize="xs" fontWeight="bold">
									Assessment Type :{" "}
									<Badge
										bg="var(--meeting_bg_light)"
										size={"xs"}
										color="var(--primary_button_bg)"
									>
										{assessment?.name}
									</Badge>
								</Text>

								{assessmentResult?.category ? (
									<Badge bg="green" color="var(--main_color)">
										{assessmentResult?.category}
									</Badge>
								) : (
									<Badge
										bg="green"
										color="var(--main_color)"
										visibility={"hidden"}
									>
										NA
									</Badge>
								)}

								<Text color={"brand.nav_color"} fontSize="xs" fontWeight="bold">
									Your result
								</Text>
								<Text fontWeight="bolder">
									{assessmentResult ? assessmentResult.result : "NA"}
								</Text>

								<Button
									w={"100%"}
									p={"5px 0"}
									bg="var(--primary_button_bg)"
									size={"xs"}
									color={"brand.primary_bg"}
									variant={"solid"}
									_hover={{ color: "brand.600" }}
									borderRadius={"10px"}
									onClick={() =>
										navigate(`/sales/assessment/${assessment.name}`)
									}
								>
									{assessmentResult ? "Re-Take" : "Take"} Assessment
								</Button>
							</VStack>
						</Box>
					);
				})}
			</SimpleGrid>
		</Box>
	);
};

export default AssociateViewCard;
