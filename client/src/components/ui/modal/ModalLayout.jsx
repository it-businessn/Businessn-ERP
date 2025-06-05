import {
	Alert,
	AlertIcon,
	Box,
	Divider,
	Flex,
	HStack,
	IconButton,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Stack,
} from "@chakra-ui/react";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
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
	empName,
	p,
	fileName,
	w = "100%",
	mx,
}) => {
	const componentRef = useRef();
	const [isPrintDisabled, setIsPrintDisabled] = useState(true);
	const [reportFileName, setReportFileName] = useState(null);

	useEffect(() => {
		if (isReport) {
			setIsPrintDisabled(children);
			setReportFileName(
				empName
					? `${formatDateBar(reportData?.payPeriodEndDate)} PayPeriod#${
							reportData?.payPeriodNum
					  } ${empName.replace(/\s+/g, "")} Paystub`
					: fileName ||
							`${formatDateBar(reportData?.payPeriodEndDate)} PayPeriod#${
								reportData?.payPeriodNum
							} Register Report`,
			);
		}
	}, [isReport]);

	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
		onBeforeGetContent: () => {
			document.title = reportFileName;
		},
	});

	const handleClick = () => {
		setIsPrintDisabled((prev) => !prev);
		setTimeout(() => handlePrint(), 1000);
	};

	return (
		<Modal isCentered={isCentered} size={size} isOpen={isOpen} onClose={onClose}>
			{!hideOverlay && <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />}
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
							{isReport && <Box w={"70px"} />}
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
						<Divider />
					</ModalHeader>
				)}
				<ModalBody
					p={(hideOverlay || isReport) && 0}
					zIndex="0"
					ref={componentRef}
					bg={"#fff"}
					height={"100vh"}
					css={tabScrollCss}
				>
					<Stack w={w} mx={mx} p={p} spacing={spacing}>
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
