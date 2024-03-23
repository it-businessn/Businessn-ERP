import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import ActionButton from "components/ui/button/ActionButton";

const AddActualHours = ({
	isOpen,
	setIsOpen,
	modalPosition,
	setActualHours,
	actualHours,
	handleConfirm,
	handleClose,
}) => {
	return (
		<Modal isOpen={isOpen} onClose={handleClose} motionPreset="scale">
			<ModalOverlay />
			<ModalContent
				position="absolute"
				top={modalPosition.top}
				left={modalPosition.left}
			>
				<ModalHeader>Enter Actual Hours to Complete</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Input
						type="number"
						value={actualHours}
						onChange={(e) => setActualHours(parseInt(e.target.value))}
					/>
				</ModalBody>
				<ModalFooter>
					<ActionButton
						// isLoading={isSubmitting}
						name={"Confirm"}
						onClick={handleConfirm}
					/>

					<Button ml={3} colorScheme={"gray"} onClick={handleClose}>
						Cancel
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AddActualHours;
