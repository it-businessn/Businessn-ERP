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
	textAlign,
	fontSize,
}) => (
	<Modal isCentered size={size} isOpen={isOpen} onClose={onClose}>
		{!hideOverlay && <ModalOverlay />}
		<ModalContent>
			{!hideOverlay && (
				<ModalHeader
					position="sticky"
					zIndex="1"
					top={0}
					bg={"var(--main_color)"}
					textAlign={textAlign}
					fontSize={fontSize}
				>
					{title}
					<ModalCloseButton />
				</ModalHeader>
			)}
			<ModalBody p={hideOverlay && 0} zIndex="0">
				<Stack spacing="5" mt={0.5}>
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

export default ModalLayout;
