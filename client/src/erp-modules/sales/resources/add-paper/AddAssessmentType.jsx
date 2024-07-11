import {
	Alert,
	AlertIcon,
	Button,
	Flex,
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
	Radio,
	RadioGroup,
	Stack,
	useDisclosure,
} from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import { useState } from "react";
import AssessmentService from "services/AssessmentService";

const AddAssessmentType = ({
	showAddAssessmentType,
	setShowAddAssessmentType,
	setRefresh,
	company,
}) => {
	const [error, setError] = useState(false);
	const [name, setName] = useState("");
	const [hasAward, setHasAward] = useState("No");
	const [isSubmitting, setSubmitting] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);

		try {
			await AssessmentService.addAssessmentType({
				name,
				hasAward,
				companyName: company,
			});
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
				<ModalHeader>Add New Assessment Name</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack spacing="5">
						<form onSubmit={handleSubmit}>
							<Stack spacing={4}>
								<FormControl>
									<FormLabel>Assessment </FormLabel>
									<Input
										type="text"
										name="name"
										value={name}
										onChange={(e) => setName(e.target.value)}
										required
									/>
								</FormControl>
								<FormControl>
									<FormLabel>Is awarded</FormLabel>
									<RadioGroup value={hasAward} onChange={setHasAward}>
										<Flex gap={5}>
											{["Yes", "No"].map((option, index) => (
												<Radio
													key={index}
													value={option}
													border={"1px solid var(--gray2_color)"}
												>
													{option}
												</Radio>
											))}
										</Flex>
									</RadioGroup>
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
