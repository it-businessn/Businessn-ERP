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

const EditQuestionnaire = ({
	showEditQuestion,
	setShowEditQuestion,
	setRefresh,
	formData,
	setFormData,
}) => {
	const [error, setError] = useState(false);
	const [name, setName] = useState("");
	const [isSubmitting, setSubmitting] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);

		if (typeof formData.options === "string") {
			formData.options = formData.options.split(",");
		}
		try {
			await QuestionnaireService.updateQuestionnaire(formData, formData._id);
			setRefresh((prev) => !prev);
			setSubmitting(false);
			onClose();
			setShowEditQuestion(false);
		} catch (error) {
			setSubmitting(false);
			onClose();
			setShowEditQuestion(false);
		}
	};
	return (
		<Modal
			isCentered
			size={"xl"}
			isOpen={showEditQuestion}
			onClose={() => {
				onClose();
				setShowEditQuestion(false);
			}}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Edit Questionnaire</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack spacing="5">
						<form onSubmit={handleSubmit}>
							<Stack spacing={4}>
								<FormControl>
									<FormLabel>Question</FormLabel>
									<Input
										type="text"
										name="question"
										value={formData.question}
										onChange={(e) =>
											setFormData((prevData) => ({
												...prevData,
												question: e.target.value,
											}))
										}
										required
									/>
								</FormControl>
								<FormControl>
									<FormLabel>Options</FormLabel>
									<Input
										type="text"
										name="
										options"
										value={formData.options}
										onChange={(e) =>
											setFormData((prevData) => ({
												...prevData,
												options: e.target.value,
											}))
										}
										required
									/>
								</FormControl>
								<FormControl>
									<FormLabel>Correct Answer</FormLabel>
									<Input
										type="text"
										name="
										correctAnswer"
										value={formData.correctAnswer}
										onChange={(e) =>
											setFormData((prevData) => ({
												...prevData,
												correctAnswer: e.target.value,
											}))
										}
										required
									/>
								</FormControl>
								<FormControl>
									<FormLabel>Explanation</FormLabel>
									<Input
										type="text"
										name="
										explanation"
										value={formData.explanation}
										onChange={(e) =>
											setFormData((prevData) => ({
												...prevData,
												explanation: e.target.value,
											}))
										}
										required
									/>
								</FormControl>
								<HStack justifyContent={"end"}>
									<PrimaryButton
										name="Save"
										isLoading={isSubmitting}
										px="2em"
									/>

									<Button
										onClick={() => {
											onClose();
											setShowEditQuestion(false);
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

export default EditQuestionnaire;
