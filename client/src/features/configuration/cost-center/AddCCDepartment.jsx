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
	const [description, setDescription] = useState("");

	const handleSubmit = async () => {
		try {
			if (!name.trim()) return;
			const { data } = await SettingService.updateCCDept(
				{ name, description, companyName },
				addDeptCCId,
			);
			toast({
				title: "Cost Center department added successfully",
				status: "success",
				duration: 1500,
				isClosable: true,
			});
			addDepartment(data.deptId, name);
		} catch (error) {
			toast({
				title: "Error",
				description: error?.response?.data?.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			onClose();
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
						onClick={handleSubmit}
					/>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AddCCDepartment;
