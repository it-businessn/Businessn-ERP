import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useToast,
} from "@chakra-ui/react";
import InputFormControl from "components/ui/form/InputFormControl";
import { useState } from "react";
import SettingService from "services/SettingService";

export const EditCostCenter = ({ companyName, isOpen, onClose, setCcAdded, cc }) => {
	const toast = useToast();
	const [name, setName] = useState(cc.name);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [description, setDescription] = useState(cc.description);

	const handleSubmit = async () => {
		if (isSubmitting) return;
		try {
			if (!name.trim()) return;
			setIsSubmitting(true);
			await SettingService.addCC({
				name,
				description,
				companyName,
			});
			toast({
				title: "Cost Center added successfully",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			setCcAdded((prev) => !prev);
			onClose();
		} catch (error) {
			toast({
				title: "Could not save cost center",
				description: error?.response?.data?.message || "Please try again.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Edit Cost Center</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<InputFormControl
						label={"Name"}
						size={"sm"}
						name="CCName"
						valueText={name}
						handleChange={(e) => setName(e.target.value)}
						required
						placeholder="Enter CC Name"
					/>
					<InputFormControl
						size={"sm"}
						label={"Description"}
						name="CCDescription"
						valueText={description}
						handleChange={(e) => setDescription(e.target.value)}
						required
						placeholder="Enter CC Description"
					/>
				</ModalBody>

				<ModalFooter>
					<Button mr={3} onClick={onClose}>
						Cancel
					</Button>
					<Button colorScheme="green" onClick={handleSubmit} isLoading={isSubmitting}>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
