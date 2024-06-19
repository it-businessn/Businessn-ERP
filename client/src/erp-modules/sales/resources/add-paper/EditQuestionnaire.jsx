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
import TextAreaFormControl from "components/ui/form/TextAreaFormControl";
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
								<TextAreaFormControl
									label={"Question"}
									name="question"
									valueText={formData.question}
									handleChange={(e) =>
										setFormData((prevData) => ({
											...prevData,
											question: e.target.value,
										}))
									}
									required
								/>

								{/* {console.log(formData.options)}{formData.options.map(option=>)} */}
								<TextAreaFormControl
									label={"Options"}
									name="options"
									rows={4}
									valueText={formData.options}
									handleChange={(e) =>
										setFormData((prevData) => ({
											...prevData,
											options: e.target.value,
										}))
									}
									required
								/>
								{/* <FormControl>
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
								</FormControl> */}
								<FormControl>
									<FormLabel>Best Answer</FormLabel>
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
								<TextAreaFormControl
									label={"Explanation"}
									name="explanation"
									rows={5}
									valueText={formData.explanation}
									handleChange={(e) =>
										setFormData((prevData) => ({
											...prevData,
											explanation: e.target.value,
										}))
									}
									required
								/>

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
