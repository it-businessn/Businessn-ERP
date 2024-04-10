import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	Radio,
	RadioGroup,
	Text,
	Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import QuestionnaireService from "services/QuestionnaireService";

const AddQuestionForm = () => {
	const [question, setQuestion] = useState("");
	const [options, setOptions] = useState(["", "", "", ""]);
	const [correctAnswer, setCorrectAnswer] = useState("");
	const [explanation, setExplanation] = useState("");

	const handleOptionChange = (index, value) => {
		const newOptions = [...options];
		newOptions[index] = value;
		setOptions(newOptions);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await QuestionnaireService.addQuestionnaire({
				question,
				options,
				correctAnswer,
				explanation,
			});
		} catch (error) {
			console.error(error);
		}

		setQuestion("");
		setOptions(["", "", "", ""]);
		setCorrectAnswer("");
		setExplanation("");
	};

	return (
		<Box p={{ base: "1em", md: "2em" }} overflow={"auto"}>
			<Text fontWeight="bold" mb={"1em"}>
				Resources
			</Text>
			<Box maxWidth="600px" margin="auto">
				<form onSubmit={handleSubmit}>
					<FormControl id="question" marginBottom="4">
						<FormLabel>Question</FormLabel>
						<Input
							type="text"
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
						/>
					</FormControl>

					<FormControl marginBottom="4">
						<FormLabel>Options</FormLabel>
						{options.map((option, index) => (
							<Input
								key={index}
								type="text"
								value={option}
								onChange={(e) => handleOptionChange(index, e.target.value)}
								marginBottom="2"
							/>
						))}
					</FormControl>

					<FormControl marginBottom="4">
						<FormLabel>Correct Answer</FormLabel>
						<RadioGroup value={correctAnswer} onChange={setCorrectAnswer}>
							{options.map((option, index) => (
								<Radio key={index} value={option}>
									{option}
								</Radio>
							))}
						</RadioGroup>
					</FormControl>

					<FormControl marginBottom="4">
						<FormLabel>Explanation</FormLabel>
						<Textarea
							value={explanation}
							onChange={(e) => setExplanation(e.target.value)}
							rows={4}
						/>
					</FormControl>

					<Button type="submit" colorScheme="blue">
						Add Question
					</Button>
				</form>
			</Box>
		</Box>
	);
};

export default AddQuestionForm;
