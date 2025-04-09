import {
	Alert,
	AlertIcon,
	Box,
	Flex,
	HStack,
	IconButton,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Spacer,
	Stack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { formatDateBar } from "utils/convertDate";

const ModalLayout = ({
	title,
	isOpen,
	onClose,
	children,
	error,
	size = "5xl",
	hideOverlay,
	textAlign,
	fontSize,
	isCentered = true,
	isReport,
	spacing = "5",
	reportData,
	px,
	empName,
	p,
}) => {
	const componentRef = useRef();
	const [isPrintDisabled, setIsPrintDisabled] = useState(true);

	useEffect(() => {
		setIsPrintDisabled(isReport && children);
	}, [isReport]);

	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
		onBeforeGetContent: () => {
			document.title = empName
				? `${formatDateBar(reportData)}${empName.replace(/\s+/g, "")}_Paystub.pdf`
				: `${formatDateBar(reportData)}_Paystub`;
		},
	});

	const handleClick = () => {
		setIsPrintDisabled((prev) => !prev);
		setTimeout(() => handlePrint(), 1000);
	};

	return (
		<Modal isCentered={isCentered} size={size} isOpen={isOpen} onClose={onClose}>
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
						<Flex justify="space-between">
							{isReport && <Spacer />}
							{title}
							{isReport ? (
								<HStack alignItems="center" gap={"1em"}>
									<IconButton
										size={"lg"}
										icon={<FaPrint />}
										aria-label="Print"
										variant="round"
										onClick={handleClick}
										isDisabled={!isPrintDisabled}
									/>
									<Box>
										<ModalCloseButton sx={{ marginTop: "14px" }} />
									</Box>
								</HStack>
							) : (
								<ModalCloseButton />
							)}
						</Flex>
					</ModalHeader>
				)}
				<ModalBody p={hideOverlay && 0} zIndex="0" ref={componentRef} bg={"#fff"} height={"100vh"}>
					<Stack w="100%" px={px} p={p} spacing={spacing} border={isReport && "1px solid black"}>
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
