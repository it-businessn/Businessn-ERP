import {
	Box,
	FormControl,
	FormLabel,
	HStack,
	Radio,
	RadioGroup,
	Text,
	VStack,
} from "@chakra-ui/react";
import ActionButtonGroup from "components/ui/form/ActionButtonGroup";
import useCompany from "hooks/useCompany";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AssessmentService from "services/AssessmentService";
import LocalStorageService from "services/LocalStorageService";
import QuestionnaireService from "services/QuestionnaireService";

const Assessment = () => {
	const { company } = useCompany(
		LocalStorageService.getItem("selectedCompany"),
	);
	const userId = LocalStorageService.getItem("user")?._id;
	const { category } = useParams();
	const [questionnaires, setQuestionnaires] = useState(null);
	const navigate = useNavigate();
	const [answers, setAnswers] = useState({});
	const [showExplanation, setShowExplanation] = useState(false);
	const [correctCount, setCorrectCount] = useState(0);

	useEffect(() => {
		const fetchAllAssessments = async () => {
			try {
				const response = await QuestionnaireService.getSubjectQuestionnaire({
					type: category,
					company,
				});
				setQuestionnaires(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllAssessments();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		let count = 0;
		questionnaires.forEach((question) => {
			if (answers[question._id] === question.correctAnswer) {
				count++;
			}
		});
		setCorrectCount(count);
		try {
			setShowExplanation(true);
			await AssessmentService.addAssessmentStatus({
				subject: category,
				score: count,
				category: count === questionnaires.length ? "PASS" : "ALMOST!",
				result: `${count}/${questionnaires.length}`,
				empId: userId,
				total: questionnaires.length,
				companyName: company,
			});
		} catch (error) {
			console.error(error);
		}
	};
	const handleAnswerChange = (questionId, answer) => {
		setAnswers((prevAnswers) => ({
			...prevAnswers,
			[questionId]: answer,
		}));
		setShowExplanation(false);
	};

	return (
		<Box p={{ base: "1em", md: "2em" }} overflow={"auto"}>
			<Text fontWeight="bold" mb={"1em"}>
				Quiz Name : {category}
			</Text>
			<Box maxWidth="1000px">
				<form onSubmit={handleSubmit}>
					{questionnaires?.map((questionnaire, index) => (
						<FormControl key={questionnaire._id} mb={3}>
							<FormLabel fontSize={"1em"}>{`${index + 1}: ${
								questionnaire.question
							}`}</FormLabel>
							<HStack w={"100%"}>
								<RadioGroup
									onChange={(e) => handleAnswerChange(questionnaire._id, e)}
									value={answers[questionnaire._id]}
								>
									<VStack
										spacing={3}
										justifyContent={"flex-start"}
										alignItems={"self-start"}
									>
										{questionnaire.options.map((item) => (
											<Radio
												value={item}
												key={item}
												border={"1px solid var(--gray2_color)"}
											>
												{item}
											</Radio>
										))}
									</VStack>
								</RadioGroup>
							</HStack>

							{showExplanation && (
								<VStack align={"self-start"} ml={4}>
									<Box fontSize={"sm"}>
										Results:{" "}
										<Text
											fontWeight="bold"
											color={
												answers[questionnaire._id] ===
												questionnaire.correctAnswer
													? "var(--correct_ans)"
													: "var(--incorrect_ans)"
											}
										>
											{answers[questionnaire._id] ===
											questionnaire.correctAnswer
												? "Correct!"
												: "Incorrect!"}
										</Text>
									</Box>
									<Text fontSize={"sm"} fontWeight={"bold"} color={"green"}>
										Best Answer: {questionnaire.correctAnswer}
									</Text>
									<Text fontSize={"sm"} fontWeight="bold">
										Explanation: {questionnaire.explanation}
									</Text>
								</VStack>
							)}
						</FormControl>
					))}
					<ActionButtonGroup
						isDisabled={showExplanation}
						submitBtnName={"Submit"}
						onClose={() => navigate(-1)}
						closeLabel="Go back"
					/>
				</form>
			</Box>
		</Box>
	);
};

export default Assessment;
