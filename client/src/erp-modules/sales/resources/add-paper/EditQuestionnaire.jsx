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
import RadioFormControl from "components/ui/form/RadioFormControl";
import TextAreaFormControl from "components/ui/form/TextAreaFormControl";
import React, { useState } from "react";
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

		if (typeof formData?.options === "string") {
			formData.options = formData?.options.split(",");
		}
		try {
			await QuestionnaireService.updateQuestionnaire(formData, formData?._id);
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

	const handleOptionChange = (index, value) => {
		setFormData((prev) => {
			const updated = [...prev.options];
			updated[index] = value;
			return { ...prev, options: updated };
		});
	};

	const addOption = () => {
		setFormData((prev) => ({
			...prev,
			options: [...prev.options, ""],
		}));
	};

	const removeOption = (index) => {
		setFormData((prev) => ({
			...prev,
			options: prev.options.filter((_, i) => i !== index),
		}));
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
									valueText={formData?.question}
									handleChange={(e) =>
										setFormData((prevData) => ({
											...prevData,
											question: e.target.value,
										}))
									}
									required
								/>

								<FormControl>
									<FormLabel>Options</FormLabel>
									<Stack>
										{formData.options.map((option, index) => (
											<React.Fragment key={`{QUEST_OPTION_${index}}`}>
												<Input
													type="text"
													value={option}
													placeholder={`Option ${index + 1}`}
													onChange={(e) => handleOptionChange(index, e.target.value)}
												/>
											</React.Fragment>
										))}
									</Stack>
								</FormControl>
								<FormControl>
									<FormLabel>Best Answer</FormLabel>
									<RadioFormControl
										direction="column"
										size="sm"
										handleChange={(value) => {
											setFormData((prevData) => ({
												...prevData,
												correctAnswer: value,
											}));
										}}
										defaultVal={formData?.correctAnswer}
										options={formData?.options.map((option) => {
											return { name: option, value: option };
										})}
									/>
								</FormControl>
								<TextAreaFormControl
									label={"Explanation"}
									name="explanation"
									rows={5}
									valueText={formData?.explanation}
									handleChange={(e) =>
										setFormData((prevData) => ({
											...prevData,
											explanation: e.target.value,
										}))
									}
									required
								/>

								<HStack justifyContent={"end"}>
									<PrimaryButton name="Save" isLoading={isSubmitting} px="2em" />

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
