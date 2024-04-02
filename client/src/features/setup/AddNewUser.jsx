import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Stack,
} from "@chakra-ui/react";
import SignUp from "features/sign-up";

const AddNewUser = ({ isOpen, onClose, setRefresh }) => {
	return (
		<Modal isCentered size={"5xl"} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add New User</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack spacing="5">
						<SignUp isModal setRefresh={setRefresh} onClose={onClose} />
					</Stack>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default AddNewUser;
