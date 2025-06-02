import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";

const ModalForm = ({ title, children, isOpen, onClose }) => {
	return (
		<Modal isCentered size={"lg"} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
			<ModalContent>
				<ModalHeader position="sticky" zIndex="1" top={0} bg={"var(--main_color)"}>
					{title}
					<ModalCloseButton />
				</ModalHeader>
				<ModalBody zIndex="0" bg={"#fff"} height={"100vh"}>
					{children}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
export default ModalForm;
