import {
	Flex,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	Stack,
	useDisclosure,
} from "@chakra-ui/react";
import OnboardEmployee from "erp-modules/payroll/employees/pageview/OnboardEmployee";

const OnboardEmpModal = ({ showOnboard, setShowOnboard, title }) => {
	const { onClose } = useDisclosure();

	const handleClose = () => {
		onClose();
		setShowOnboard(false);
	};

	return (
		<Modal isCentered={true} size={"7xl"} isOpen={showOnboard} onClose={handleClose} m={0}>
			<ModalContent>
				<ModalHeader position="sticky" zIndex="1" top={0} bg={"var(--main_color)"}>
					<Flex justify="space-between">
						{title}
						<ModalCloseButton />
					</Flex>
				</ModalHeader>
				<ModalBody zIndex="0" bg={"#fff"} height={"100vh"} m={0}>
					<Stack w="100%" spacing={5}>
						<OnboardEmployee handleClose={handleClose} />
					</Stack>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default OnboardEmpModal;
