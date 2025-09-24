import { Box, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { questionnairePath } from "routes";
import AssessmentService from "services/AssessmentService";

const ManagerViewCard = ({ assessments, setIsDeleted }) => {
	const navigate = useNavigate();
	const [deleteRecord, setDeleteRecord] = useState(false);
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);
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
						p={"1em"}
						my={"auto"}
						bg={"var(--logo_bg)"}
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
								color={"var(--th_bg)"}
								size="sm"
								whiteSpace="pre-wrap"
								title={assessment.name}
							/>
							<HStack spacing={2}>
								<PrimaryButton
									hover={{
										color: "var(--th_bg)",
										bg: "var(--primary_button_bg)",
										border: "1px solid var(--primary_button_bg)",
									}}
									w="100px"
									size={"xs"}
									name={"View / Update"}
									onOpen={() => navigate(`/sales/add-paper/${assessment.name}`)}
								/>
								<PrimaryButton
									hover={{
										color: "var(--th_bg)",
										bg: "var(--primary_button_bg)",
										border: "1px solid var(--primary_button_bg)",
									}}
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
