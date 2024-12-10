import { Box, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { questionnairePath } from "routes";
import AssessmentService from "services/AssessmentService";

const ManagerViewCard = ({ company }) => {
	const navigate = useNavigate();
	const [assessments, setAssessments] = useState(null);
	const [isDeleted, setIsDeleted] = useState(false);
	const [deleteRecord, setDeleteRecord] = useState(false);
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);

	useEffect(() => {
		const fetchAllAssessmentTypes = async () => {
			try {
				const { data } = await AssessmentService.getAssessmentTypes(company);
				setAssessments(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllAssessmentTypes();
	}, [company, isDeleted]);

	const handleDelete = async () => {
		try {
			await AssessmentService.deleteAssessment({}, deleteRecord);
			setIsDeleted((prev) => !prev);
			setShowConfirmationPopUp((prev) => !prev);
		} catch (error) {
			console.error(error);
		}
	};
	const handleClose = () => {
		setShowConfirmationPopUp((prev) => !prev);
	};

	return (
		<Box
			p="1em"
			pt={"0.5em"}
			border="3px solid var(--main_color)"
			borderRadius="10px"
			fontWeight="bold"
			color={"var(--nav_color)"}
		>
			<HStack>
				<TextTitle flex={1} mb={"0.5em"} title="All Assessment" />
				<PrimaryButton
					size={"xs"}
					name={"Add Assessments"}
					loadingText="Loading"
					onOpen={() => navigate(questionnairePath)}
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
						bg={"var(--primary_bg)"}
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
								// color={"var(--nav_color)"}
								size="sm"
								whiteSpace="pre-wrap"
								title={assessment.name}
								color="var(--primary_button_bg)"
							/>
							<HStack spacing={2}>
								<PrimaryButton
									size={"xs"}
									name={"View / Update"}
									onOpen={() => navigate(`/sales/add-paper/${assessment.name}`)}
								/>
								<PrimaryButton
									size={"xs"}
									name={"Delete"}
									onOpen={() => {
										setShowConfirmationPopUp(true);
										setDeleteRecord(assessment._id);
									}}
								/>
							</HStack>
						</VStack>
					</Box>
				))}
			</SimpleGrid>
			{showConfirmationPopUp && (
				<DeletePopUp
					headerTitle={"Delete Assessment"}
					textTitle={"Are you sure you want to delete the assessment?"}
					isOpen={showConfirmationPopUp}
					onClose={handleClose}
					onOpen={handleDelete}
				/>
			)}
		</Box>
	);
};

export default ManagerViewCard;
