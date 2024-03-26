import {
	Button,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalOverlay,
} from "@chakra-ui/react";
import ActionButton from "components/ui/button/ActionButton";
import { useState } from "react";
import NotesService from "services/NotesService";

const AddNotes = ({ data, type, setIsOpen, isOpen, setRefresh }) => {
	const [formData, setFormData] = useState({
		type,
		name: data?.name || data?.taskName,
		notes: data?.notes,
	});

	const [isEdit, setIsEdit] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleClick = (e) => {
		e.preventDefault();

		setIsEdit((prev) => !prev);
		if (!isEdit) {
			return;
		}
		handleConfirm();
	};
	const handleConfirm = async () => {
		setIsSubmitting(true);
		try {
			await NotesService.updateNotes(formData, data._id);
			setIsOpen(false);
			setIsSubmitting(false);
			setIsEdit(false);
			setRefresh((prev) => !prev);
		} catch (error) {
			setIsSubmitting(false);
			setIsOpen(false);
			setIsEdit(false);
		}
	};

	return (
		<Modal isOpen={isOpen} size={"xl"} onClose={() => setIsOpen(false)}>
			<ModalOverlay />
			<ModalContent>
				<ModalCloseButton />
				<ModalBody>
					<FormLabel>Name</FormLabel>
					<Input
						type="text"
						name="name"
						value={formData.name}
						border={"none"}
						readOnly
					/>
					<FormLabel>Description</FormLabel>
					<Input
						type="text"
						name="notes"
						value={formData.notes}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								notes: e.target.value,
							}))
						}
						placeholder="Click on Edit to add notes"
						readOnly={isEdit ? false : true}
						border={isEdit ? "1px solid var(--chakra-colors-gray-300)" : "none"}
					/>
				</ModalBody>
				<ModalFooter>
					<ActionButton
						isLoading={isSubmitting}
						name={isEdit ? "Save" : "Edit"}
						onClick={handleClick}
					/>

					<Button ml={3} colorScheme={"gray"} onClick={() => setIsOpen(false)}>
						Cancel
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AddNotes;
