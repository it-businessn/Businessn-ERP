import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useToast,
} from "@chakra-ui/react";
import ActionButton from "components/ui/button/ActionButton";
import InputFormControl from "components/ui/form/InputFormControl";
import { useState } from "react";
import SettingService from "services/SettingService";

const AddCCDepartment = ({ isOpen, onClose, cc, addDeptCCId, companyName, addDepartment }) => {
	const toast = useToast();
	const [name, setName] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [description, setDescription] = useState("");

	const handleSubmit = async () => {
		if (isSubmitting) return;
		try {
			if (!name.trim()) return;
			setIsSubmitting(true);
			const { data } = await SettingService.updateCCDept(
				{ name, description, companyName },
				addDeptCCId,
			);
			toast({
				title: "Cost Center department added successfully",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			addDepartment(data.deptId, name);
			onClose();
		} catch (error) {
			toast({
				title: "Could not add department",
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
				<ModalHeader>
					{cc.name} {">"} Department
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<InputFormControl
						label={"Name"}
						size={"sm"}
						name="CCName"
						valueText={name}
						handleChange={(e) => setName(e.target.value)}
						required
						placeholder="Enter Dept Name"
					/>
					<InputFormControl
						size={"sm"}
						label={"Description"}
						name="CCDescription"
						valueText={description}
						handleChange={(e) => setDescription(e.target.value)}
						required
						placeholder="Enter Dept Description"
					/>
				</ModalBody>
				<ModalFooter>
					<ActionButton
						size={"sm"}
						isDisabled={!name || !description}
						name="Add"
						isLoading={isSubmitting}
						onClick={handleSubmit}
					/>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AddCCDepartment;
