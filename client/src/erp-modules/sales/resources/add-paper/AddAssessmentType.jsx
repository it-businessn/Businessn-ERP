import {
	Alert,
	AlertIcon,
	Button,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Stack,
	useDisclosure,
} from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import { useState } from "react";
import QuestionnaireService from "services/QuestionnaireService";

const AddAssessmentType = ({
	showAddAssessmentType,
	setShowAddAssessmentType,
	setRefresh,
}) => {
	const [error, setError] = useState(false);
	const [name, setName] = useState("");
	const [isSubmitting, setSubmitting] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);

		try {
			await QuestionnaireService.addAssessmentType({ name });
			setRefresh((prev) => !prev);
			setSubmitting(false);
			onClose();
			setShowAddAssessmentType(false);
		} catch (error) {
			setSubmitting(false);
			onClose();
			setShowAddAssessmentType(false);
		}
	};
	return (
		<Modal
			isCentered
			size={"md"}
			isOpen={showAddAssessmentType}
			onClose={() => {
				onClose();
				setShowAddAssessmentType(false);
			}}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add New Assessment Subject</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack spacing="5">
						<form onSubmit={handleSubmit}>
							<Stack spacing={4}>
								<FormControl>
									<FormLabel>Assessment Type</FormLabel>
									<Input
										type="text"
										name="name"
										value={name}
										onChange={(e) => setName(e.target.value)}
										required
									/>
								</FormControl>

								<HStack justifyContent={"end"}>
									<PrimaryButton
										isDisabled={name === ""}
										name="Add"
										isLoading={isSubmitting}
										px="2em"
									/>

									<Button
										onClick={() => {
											onClose();
											setShowAddAssessmentType(false);
										}}
										colorScheme="gray"
									>
										Cancel
									</Button>
								</HStack>
							</Stack>
						</form>
						{error && (
							<Alert status="error" mt={4}>
								<AlertIcon />
								{error}
							</Alert>
						)}
					</Stack>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default AddAssessmentType;
