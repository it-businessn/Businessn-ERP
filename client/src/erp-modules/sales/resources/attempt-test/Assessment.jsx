import {
	Box,
	Button,
	FormControl,
	FormLabel,
	HStack,
	Radio,
	RadioGroup,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import QuestionnaireService from "services/QuestionnaireService";

const Assessment = () => {
	const userId = LocalStorageService.getItem("user")?._id;
	const { category } = useParams();
	const [questionnaires, setQuestionnaires] = useState(null);
	const navigate = useNavigate();
	const [answers, setAnswers] = useState({});
	const [showExplanation, setShowExplanation] = useState(false);
	const [correctCount, setCorrectCount] = useState(0);
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
		const fetchAllAssessments = async () => {
			try {
				const response = await QuestionnaireService.getAssessmentByType({
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
			await QuestionnaireService.addAssessmentStatus({
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
										Correct Answer: {questionnaire.correctAnswer}
									</Text>
									<Text fontSize={"sm"} fontWeight="bold">
										Explanation: {questionnaire.explanation}
									</Text>
								</VStack>
							)}
						</FormControl>
					))}
					<HStack mt={3}>
						<Button
							size={"sm"}
							type="submit"
							bg="var(--primary_button_bg)"
							color={"brand.primary_bg"}
							_hover={{ color: "brand.600" }}
							borderRadius={"10px"}
						>
							Submit
						</Button>
						<Button
							variant={"outline"}
							size={"sm"}
							colorScheme={"gray"}
							onClick={() => navigate(-1)}
							borderRadius={"10px"}
						>
							Go back
						</Button>
					</HStack>
				</form>
			</Box>
		</Box>
	);
};

export default Assessment;
