import {
	Alert,
	AlertIcon,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Stack,
} from "@chakra-ui/react";

const ModalLayout = ({
	title,
	isOpen,
	onClose,
	children,
	error,
	size = "4xl",
	hideOverlay,
}) => {
	return (
		<Modal isCentered size={size} isOpen={isOpen} onClose={onClose}>
			{!hideOverlay && <ModalOverlay />}
			<ModalContent>
				{!hideOverlay && <ModalHeader>{title}</ModalHeader>}
				{!hideOverlay && <ModalCloseButton />}
				<ModalBody p={hideOverlay && 0}>
					<Stack spacing="5">
						{children}
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

export default ModalLayout;
