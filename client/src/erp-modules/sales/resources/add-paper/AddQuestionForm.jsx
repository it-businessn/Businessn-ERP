import {
	Box,
	FormControl,
	FormLabel,
	HStack,
	Icon,
	Input,
	Radio,
	RadioGroup,
	Select,
	Text,
	Textarea,
	VStack,
} from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import DeletePopUp from "components/ui/modal/DeletePopUp";
import TextTitle from "components/ui/text/TextTitle";
import useCompany from "hooks/useCompany";
import { useEffect, useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { RiEditLine } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import AssessmentService from "services/AssessmentService";
import LocalStorageService from "services/LocalStorageService";
import QuestionnaireService from "services/QuestionnaireService";
import AddAssessmentType from "./AddAssessmentType";
import EditQuestionnaire from "./EditQuestionnaire";

const AddQuestionForm = () => {
	const { type } = useParams();
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));

	const [assessmentTypes, setAssessmentTypes] = useState(null);
	const [assessmentType, setAssessmentType] = useState(type || "");
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
				const { data } = await AssessmentService.getAssessmentTypes(company);
				setAssessmentTypes(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllAssessmentTypes();
		const fetchQuestionsByType = async (type) => {
			try {
				const { data } = await QuestionnaireService.getSubjectQuestionnaire({
					type,
					company,
				});
				setQuestionnaires(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (assessmentType) {
			fetchQuestionsByType(assessmentType);
		}
	}, [assessmentType, refresh, company]);

	const handleOptionChange = (index, value) => {
		const newOptions = [...options];
		newOptions[index] = value;
		setOptions(newOptions);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await QuestionnaireService.addQuestionnaire({
				assessmentType,
				company,
				correctAnswer,
				explanation,
				options,
				question,
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
	const [deleteRecord, setDeleteRecord] = useState(false);
	const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);

	const navigate = useNavigate();

	const handleEdit = (questionnaire) => {
		const { _id, correctAnswer, options, question, explanation, subject } = questionnaire;
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

	const handleDelete = async () => {
		try {
			await QuestionnaireService.deleteQuestion({}, deleteRecord);
			setRefresh((prev) => !prev);
			setShowConfirmationPopUp((prev) => !prev);
		} catch (error) {
			console.error(error);
		}
	};

	const handleClose = () => {
		setShowConfirmationPopUp((prev) => !prev);
	};

	return (
		<Box p={{ base: "1em", md: "2em" }} overflow={"auto"}>
			<HStack justify={"space-between"}>
				<TextTitle title="Resources" />

				<PrimaryButton
					size={"xs"}
					name={"Add New Quiz"}
					loadingText="Loading"
					onOpen={() => setShowAddAssessmentType(true)}
				/>
			</HStack>

			{questionnaires?.map((questionnaire, index) => (
				<Box
					key={questionnaire._id}
					bg={"var(--primary_bg)"}
					border="3px solid var(--main_color)"
					p={{ base: "1em" }}
					mt={"0.5em"}
				>
					<HStack>
						<FormLabel>{`${index + 1}: ${questionnaire.question}`}</FormLabel>
						<Icon
							as={RiEditLine}
							boxSize={4}
							cursor={"pointer"}
							mb={1}
							onClick={() => handleEdit(questionnaire)}
						/>
						<Icon
							as={FaRegTrashCan}
							boxSize={3.5}
							cursor={"pointer"}
							mb={1}
							onClick={() => {
								setShowConfirmationPopUp(true);
								setDeleteRecord(questionnaire._id);
							}}
						/>
					</HStack>
					<FormLabel>
						<HStack alignItems="start">
							<Text ml={6}>Options:</Text>
							{questionnaire.options.map((_, index) => (
								<HStack key={_} spacing={1} alignItems="start" justifyContent={"start"} w={"100%"}>
									<TextTitle whiteSpace="pre-wrap" flex={0.1} title={`${index + 1}:`} />
									<TextTitle flex={1} title={_} whiteSpace="pre-wrap" weight="normal" />
								</HStack>
							))}
						</HStack>
					</FormLabel>
					<FormLabel color={"green"}>
						<HStack alignItems="start">
							<Text ml={6}>Best answer:</Text>
							<Text>{questionnaire.correctAnswer}</Text>
						</HStack>
					</FormLabel>

					<FormLabel fontWeight={"bold"}>
						<HStack alignItems="start">
							<Text ml={6}>Explanation:</Text>
							<Text>{questionnaire.explanation}</Text>
						</HStack>
					</FormLabel>
				</Box>
			))}
			{showConfirmationPopUp && (
				<DeletePopUp
					headerTitle={"Delete Question"}
					textTitle={"Are you sure you want to delete the question?"}
					isOpen={showConfirmationPopUp}
					onClose={handleClose}
					onOpen={handleDelete}
				/>
			)}
			{showEditQuestion && (
				<EditQuestionnaire
					setFormData={setFormData}
					showEditQuestion={showEditQuestion}
					setRefresh={setRefresh}
					setShowEditQuestion={setShowEditQuestion}
					formData={formData}
				/>
			)}
			{showAddAssessmentType && (
				<AddAssessmentType
					showAddAssessmentType={showAddAssessmentType}
					setRefresh={setRefresh}
					setShowAddAssessmentType={setShowAddAssessmentType}
					company={company}
				/>
			)}
			{!assessmentTypes && (
				<Text color={"green"}>No assessments available. Please add new quiz.</Text>
			)}
			<Box mt={3}>
				<form onSubmit={handleSubmit}>
					{assessmentTypes && (
						<FormControl>
							<FormLabel>Assessment:</FormLabel>
							<HStack justify={"space-between"}>
								<Select
									name="assessmentType"
									value={assessmentType}
									bg={"var(--main_color)"}
									onChange={(e) => setAssessmentType(e.target.value)}
									placeholder="Select Assessment"
								>
									{assessmentTypes?.map((assessment) => (
										<option key={assessment._id} value={assessment.name}>
											{assessment.name}
										</option>
									))}
								</Select>
								{/* <FaPlus onClick={() => setShowAddAssessmentType(true)} /> */}
							</HStack>
						</FormControl>
					)}
					<FormControl id="question">
						<FormLabel>Question:</FormLabel>
						<Input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} />
					</FormControl>

					<FormControl>
						<FormLabel>Options:</FormLabel>
						<VStack>
							{options.map((option, index) => (
								<Input
									key={index}
									type="text"
									value={option}
									onChange={(e) => handleOptionChange(index, e.target.value)}
									marginBottom="2"
								/>
							))}
						</VStack>
					</FormControl>
					{optionsFilled && (
						<>
							<FormControl>
								<FormLabel>Best Answer:</FormLabel>
								<RadioGroup value={correctAnswer} onChange={setCorrectAnswer}>
									<VStack spacing={3} justifyContent={"flex-start"} alignItems={"self-start"}>
										{options.map((option, index) => (
											<Radio key={index} value={option} border={"1px solid var(--gray2_color)"}>
												{option}
											</Radio>
										))}
									</VStack>
								</RadioGroup>
							</FormControl>

							<FormControl mb={3}>
								<FormLabel>Explanation:</FormLabel>
								<Textarea
									value={explanation}
									onChange={(e) => setExplanation(e.target.value)}
									rows={5}
								/>
							</FormControl>
						</>
					)}
					<ActionButtonGroup submitBtnName={"Add Question"} onClose={() => navigate(-1)} />
				</form>
			</Box>
		</Box>
	);
};

export default AddQuestionForm;
