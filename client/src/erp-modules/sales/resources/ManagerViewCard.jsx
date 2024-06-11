import { Box, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "routes";
import LocalStorageService from "services/LocalStorageService";
import QuestionnaireService from "services/QuestionnaireService";

const ManagerViewCard = () => {
	const navigate = useNavigate();
	const [assessments, setAssessments] = useState(null);
	const [company, setCompany] = useState(
		LocalStorageService.getItem("selectedCompany"),
	);

	useEffect(() => {
		const handleSelectedCompanyChange = (event) => setCompany(event.detail);

		document.addEventListener(
			"selectedCompanyChanged",
			handleSelectedCompanyChange,
		);

		return () => {
			document.removeEventListener(
				"selectedCompanyChanged",
				handleSelectedCompanyChange,
			);
		};
	}, []);
	useEffect(() => {
		const fetchAllAssessmentTypes = async () => {
			try {
				const response = await QuestionnaireService.getAssessmentTypes(company);
				setAssessments(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllAssessmentTypes();
	}, [company]);
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
				mt={2}
				columns={{ base: 1, md: 1, lg: 4, xl: 6 }}
				minH={{ base: "auto", md: "90%" }}
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
						justifyContent="space-between"
						alignItems="flex-start"
					>
						<VStack
							align={"self-start"}
							justifyContent="space-between"
							spacing={2}
							w={"100%"}
							minH={{ base: "6em" }}
						>
							<TextTitle
								// color={"brand.nav_color"}
								size="sm"
								whiteSpace="pre-wrap"
								title={assessment.name}
								color="var(--primary_button_bg)"
							/>
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
