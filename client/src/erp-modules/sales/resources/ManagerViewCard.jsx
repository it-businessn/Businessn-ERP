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
import QuestionnaireService from "services/QuestionnaireService";

const ManagerViewCard = () => {
	const navigate = useNavigate();
	const [assessments, setAssessments] = useState(null);

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
	}, []);
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
					All Assessment Types
				</Text>

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
						<VStack align={"self-start"} spacing={2} w={"100%"}>
							<Text color={"brand.nav_color"} fontSize="xs" fontWeight="bold">
								Assessment Type
							</Text>
							<Badge bg="green" color="var(--main_color)">
								{assessment.name}
							</Badge>

							<Button
								w={"100%"}
								p={"5px 0"}
								bg="var(--primary_button_bg)"
								size={"xs"}
								color={"brand.primary_bg"}
								variant={"solid"}
								_hover={{ color: "brand.600" }}
								borderRadius={"10px"}
								onClick={() => navigate("/sales/add-paper")}
							>
								Add / Edit
							</Button>
						</VStack>
					</Box>
				))}
			</SimpleGrid>
		</Box>
	);
};

export default ManagerViewCard;
