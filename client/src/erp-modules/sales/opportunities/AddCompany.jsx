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
import LeadsService from "services/LeadsService";

const AddCompany = ({ showAddCompany, setShowAddCompany, setRefresh }) => {
	const [error, setError] = useState(false);
	const [companyName, setCompanyName] = useState("");
	const [isSubmitting, setSubmitting] = useState(false);
	const { onClose } = useDisclosure();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);

		try {
			await LeadsService.addLeadCompany({ companyName });
			setRefresh((prev) => !prev);
			setSubmitting(false);
			onClose();
			setShowAddCompany(false);
		} catch (error) {
			setSubmitting(false);
			onClose();
			setShowAddCompany(false);
		}
	};
	return (
		<Modal
			isCentered
			size={"md"}
			isOpen={showAddCompany}
			onClose={() => {
				onClose();
				setShowAddCompany(false);
			}}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add New Company</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack spacing="5">
						<form onSubmit={handleSubmit}>
							<Stack spacing={4}>
								<FormControl>
									<FormLabel>Company Name </FormLabel>
									<Input
										type="text"
										name="name"
										value={companyName}
										onChange={(e) => setCompanyName(e.target.value)}
										required
									/>
								</FormControl>

								<HStack justifyContent={"end"}>
									<PrimaryButton
										isDisabled={companyName === ""}
										name="Add"
										isLoading={isSubmitting}
										px="2em"
									/>

									<Button
										onClick={() => {
											onClose();
											setShowAddCompany(false);
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

export default AddCompany;
