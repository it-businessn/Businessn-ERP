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
import { convertDecimal } from "utils/convertAmt";

const AddActualHours = ({
	isOpen,
	modalPosition,
	setActualHours,
	actualHours,
	handleConfirm,
	handleClose,
}) => {
	const calculatedTop = modalPosition.top > 600 ? 600 : modalPosition.top;

	return (
		<Modal isOpen={isOpen} onClose={handleClose} motionPreset="scale">
			<ModalOverlay />
			<ModalContent position="absolute" top={calculatedTop} left={modalPosition.left}>
				<ModalHeader>Enter Actual Hours to Complete</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Input
						type="number"
						value={actualHours}
						onChange={(e) => setActualHours(convertDecimal(e.target.value))}
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
