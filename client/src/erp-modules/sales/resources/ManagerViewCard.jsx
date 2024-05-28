import { Badge, Box, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "routes";
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
				<TextTitle flex={1} mb={"0.5em"} title="All Assessment" />
				<PrimaryButton
					size={"xs"}
					name={"Add Assessments"}
					loadingText="Loading"
					onOpen={() => navigate(`${ROUTE_PATH.SALES}${ROUTE_PATH.ADD_PAPER}`)}
				/>
			</HStack>

			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 6 }}
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
							<TextTitle
								// color={"brand.nav_color"}
								fontSize="xs"
								title={assessment.name}
								color="var(--primary_button_bg)"
							/>

							<Badge
								bg="var(--lead_cards_bg)"
								color="var(--primary_button_bg)"
								whiteSpace={"pre-wrap"}
								borderRadius={"10px"}
								visibility={"hidden"}
							>
								Text
								{/* {assessment.name} */}
							</Badge>
							<PrimaryButton
								size={"xs"}
								name={"View / Update"}
								onOpen={() => navigate(`/sales/add-paper/${assessment.name}`)}
								minW={"100%"}
							/>
						</VStack>
					</Box>
				))}
			</SimpleGrid>
		</Box>
	);
};

export default ManagerViewCard;
