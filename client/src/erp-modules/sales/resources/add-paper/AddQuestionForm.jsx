import {
	Box,
	Button,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Radio,
	RadioGroup,
	Select,
	Text,
	Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { RiEditLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import QuestionnaireService from "services/QuestionnaireService";
import AddAssessmentType from "./AddAssessmentType";
import EditQuestionnaire from "./EditQuestionnaire";

const AddQuestionForm = () => {
	const [assessmentTypes, setAssessmentTypes] = useState(null);
	const [assessmentType, setAssessmentType] = useState("");
	const [question, setQuestion] = useState("");
	const [options, setOptions] = useState(["", "", "", ""]);
	const optionsFilled = options.every((_) => _ !== "");
	const [correctAnswer, setCorrectAnswer] = useState("");
	const [explanation, setExplanation] = useState("");
	const [showAddAssessmentType, setShowAddAssessmentType] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const [questionnaires, setQuestionnaires] = useState(null);

	useEffect(() => {
		const fetchAllAssessmentTypes = async () => {
			try {
				const response = await QuestionnaireService.getAssessmentTypes();
				setAssessmentTypes(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllAssessmentTypes();
	}, [assessmentType, refresh]);

	useEffect(() => {
		const fetchQuestionsByType = async (type) => {
			try {
				const response = await QuestionnaireService.getAssessmentByType(type);
				setQuestionnaires(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		if (assessmentType) {
			fetchQuestionsByType(assessmentType);
		}
	}, [refresh, assessmentType]);

	const handleOptionChange = (index, value) => {
		const newOptions = [...options];
		newOptions[index] = value;
		setOptions(newOptions);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await QuestionnaireService.addQuestionnaire({
				assessmentType,
				question,
				options,
				correctAnswer,
				explanation,
			});
			setRefresh((prev) => !prev);
		} catch (error) {
			console.error(error);
		}

		setQuestion("");
		setOptions(["", "", "", ""]);
		setCorrectAnswer("");
		setExplanation("");
	};
	const initialInfo = {
		_id: null,
		correctAnswer: "",
		options: ["", "", "", ""],
		question: "",
		explanation: "",
		subject: "",
	};
	const [formData, setFormData] = useState(initialInfo);
	const [showEditQuestion, setShowEditQuestion] = useState("");
	const navigate = useNavigate();

	const handleEdit = (questionnaire) => {
		const { _id, correctAnswer, options, question, explanation, subject } =
			questionnaire;
		setFormData((prevData) => ({
			...prevData,
			_id,
			correctAnswer,
			options,
			question,
			explanation,
			subject,
		}));
		setShowEditQuestion(true);
	};
	return (
		<Box p={{ base: "1em", md: "2em" }} overflow={"auto"}>
			<Text fontWeight="bold" mb={"1em"}>
				Resources
			</Text>
			{questionnaires?.map((questionnaire, index) => (
				<Box key={questionnaire._id}>
					<HStack>
						<FormLabel>{`${index + 1}: ${questionnaire.question}`}</FormLabel>
						<RiEditLine
							cursor={"pointer"}
							onClick={() => handleEdit(questionnaire)}
						/>
					</HStack>
					<FormLabel>
						<HStack>
							<Text>Options :</Text>
							{questionnaire.options.map((_) => (
								<Text key={_}>{_},</Text>
							))}
						</HStack>
					</FormLabel>
					<FormLabel>
						<HStack>
							<Text>Correct answer :</Text>
							<Text>{questionnaire.correctAnswer}</Text>
						</HStack>
					</FormLabel>

					<FormLabel>
						<HStack>
							<Text>Explanation:</Text>
							<Text>{questionnaire.explanation}</Text>
						</HStack>
					</FormLabel>
				</Box>
			))}
			<EditQuestionnaire
				setFormData={setFormData}
				showEditQuestion={showEditQuestion}
				setRefresh={setRefresh}
				setShowEditQuestion={setShowEditQuestion}
				formData={formData}
			/>
			<Box maxWidth="600px" mt={3}>
				<form onSubmit={handleSubmit}>
					{assessmentTypes && (
						<FormControl>
							<FormLabel>Assessment Type</FormLabel>
							<HStack justify={"space-between"}>
								<Select
									name="assessmentType"
									value={assessmentType}
									bg={"brand.100"}
									onChange={(e) => setAssessmentType(e.target.value)}
									placeholder="Select Assessment Type"
								>
									{assessmentTypes?.map((assessment) => (
										<option key={assessment._id} value={assessment.name}>
											{assessment.name}
										</option>
									))}
								</Select>
								<FaPlus onClick={() => setShowAddAssessmentType(true)} />
							</HStack>
						</FormControl>
					)}
					<FormControl id="question">
						<FormLabel>Question</FormLabel>
						<Input
							type="text"
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
						/>
					</FormControl>

					<FormControl>
						<FormLabel>Options</FormLabel>
						<HStack>
							{options.map((option, index) => (
								<Input
									key={index}
									type="text"
									value={option}
									onChange={(e) => handleOptionChange(index, e.target.value)}
									marginBottom="2"
								/>
							))}
						</HStack>
					</FormControl>
					{optionsFilled && (
						<>
							<FormControl>
								<FormLabel>Correct Answer</FormLabel>
								<RadioGroup value={correctAnswer} onChange={setCorrectAnswer}>
									{options.map((option, index) => (
										<Radio key={index} value={option}>
											{option}
										</Radio>
									))}
								</RadioGroup>
							</FormControl>

							<FormControl>
								<FormLabel>Explanation</FormLabel>
								<Textarea
									value={explanation}
									onChange={(e) => setExplanation(e.target.value)}
									rows={4}
								/>
							</FormControl>
						</>
					)}
					<AddAssessmentType
						showAddAssessmentType={showAddAssessmentType}
						setRefresh={setRefresh}
						setShowAddAssessmentType={setShowAddAssessmentType}
					/>
					<Button
						mt={3}
						type="submit"
						w={"30%"}
						p={"5px 0"}
						bg="var(--primary_button_bg)"
						color={"brand.primary_bg"}
						variant={"solid"}
						_hover={{ color: "brand.600" }}
						borderRadius={"10px"}
					>
						Add Question
					</Button>
					<Button mt={3} onClick={() => navigate(-1)} colorScheme="gray">
						Cancel
					</Button>
				</form>
			</Box>
		</Box>
	);
};

export default AddQuestionForm;
