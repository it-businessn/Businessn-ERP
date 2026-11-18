import {
	Badge,
	Box,
	Divider,
	Flex,
	FormLabel,
	HStack,
	SimpleGrid,
	Icon,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Text,
	Tooltip,
	useColorModeValue,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { API } from "api";
import { LEAD_FIELD_LABELS, ticketPersonName } from "constant";
import { TICKET_ACTION, TICKET_ACTION_STATUS } from "erp-modules/payroll/timesheets/data";
import { useState } from "react";
import { FiDownload, FiFileText } from "react-icons/fi";
import { longTimeFormat } from "utils/convertDate";

// TICKET-DETAILS: one labelled value; nothing is shown for an empty value
const Detail = ({ label, value, color }) =>
	value || value === 0 ? (
		<Box>
			<Text fontSize="xs" color="gray.500">
				{label}
			</Text>
			<Text fontSize="sm" fontWeight="medium" color={color} wordBreak="break-word">
				{value}
			</Text>
		</Box>
	) : null;

const NoteDetails = ({ setIsOpen, isOpen, data }) => {
	const bgColor = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.700");
	const textColor = useColorModeValue("gray.700", "gray.300");
	const subTextColor = useColorModeValue("gray.600", "gray.400");
	const descriptionBg = useColorModeValue("gray.50", "gray.700");
	const hoverBg = useColorModeValue("gray.100", "gray.700");

	const toast = useToast();
	const [isDownloading, setIsDownloading] = useState(false);

	// TICKET-DETAILS: the download needs the sign-in token. Opening the URL in the
	// browser sent no token, so the server answered 401 and nothing downloaded.
	const handleDownload = async (fileName) => {
		if (isDownloading) return;
		setIsDownloading(true);
		try {
			const res = await API.get(`/ticket/download/${encodeURIComponent(fileName)}`, {
				responseType: "blob",
			});
			const url = URL.createObjectURL(res.data);
			const link = document.createElement("a");
			link.href = url;
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			link.remove();
			setTimeout(() => URL.revokeObjectURL(url), 1000);
		} catch (error) {
			toast({
				title: "Could not download the attachment.",
				description: error?.response?.status === 404 ? "The file was not found." : "Please try again.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsDownloading(false);
		}
	};

	const customerName = [data?.clientFirstName, data?.clientLastName].filter(Boolean).join(" ");
	const statusColor = TICKET_ACTION_STATUS.find(({ name }) => name === data?.status)?.color;
	const isClosed = data?.status === TICKET_ACTION.CLOSED;
	// LEAD-DETAILS: the linked CRM Lead (sent with the ticket as leadId)
	const lead = data?.leadId && typeof data.leadId === "object" ? data.leadId : null;
	const showValue = (value) => (typeof value === "boolean" ? (value ? "Yes" : "No") : value);
	const leadRows = LEAD_FIELD_LABELS.filter(
		({ key }) => lead?.[key] !== undefined && lead?.[key] !== null && lead?.[key] !== "",
	);

	return (
		<Modal isCentered isOpen={isOpen} size={"xl"} onClose={() => setIsOpen(false)}>
			<ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
			<ModalContent borderRadius="lg" boxShadow="xl" bg={bgColor} p={2}>
				<ModalHeader pb={0}>
					<Flex justifyContent="space-between" alignItems="center">
						<HStack>
							<Badge colorScheme="blue" fontSize="0.8em" px={2} py={1} borderRadius="md">
								Ticket #{data?.ticketNumber}
							</Badge>
							<Text fontWeight="bold" fontSize="lg" color={textColor}>
								{data?.topic || data?.inquiryType || ""}
							</Text>
						</HStack>
					</Flex>
				</ModalHeader>
				<ModalCloseButton size="sm" mt={2} mr={2} />
				<Divider my={3} />
				<ModalBody pb={6}>
					<VStack spacing={4} align="stretch">
						<HStack spacing={2} wrap="wrap">
							{data?.status && (
								<Badge bg={statusColor || "gray.500"} color="white" px={2} py={1} borderRadius="md">
									{data.status}
								</Badge>
							)}
							{data?.category && (
								<Badge colorScheme="purple" px={2} py={1} borderRadius="md">
									{data.category}
								</Badge>
							)}
						</HStack>
						<SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
							<Detail label="Assignee" value={data?.assignee || "Unassigned"} color={textColor} />
							<Detail label="Originator" value={ticketPersonName(data)} color={textColor} />
							<Detail label="Priority" value={data?.priority} color={textColor} />
							<Detail
								label="Created"
								value={data?.createdOn ? longTimeFormat(data.createdOn) : ""}
								color={textColor}
							/>
							{isClosed ? (
								<Detail
									label="Closed"
									value={data?.ticketClosedDate ? longTimeFormat(data.ticketClosedDate) : ""}
									color={textColor}
								/>
							) : (
								<Detail label="Days open" value={data?.ticketDaysOpened} color={textColor} />
							)}
							<Detail label="Inquiry type" value={data?.topic ? data?.inquiryType : ""} color={textColor} />
						</SimpleGrid>
						{(customerName || data?.clientEmail || data?.clientPhoneNumber) && (
							<Box>
								<FormLabel fontSize="sm" color={subTextColor}>
									Customer contact
								</FormLabel>
								<SimpleGrid
									columns={{ base: 1, sm: 2 }}
									spacing={3}
									p={3}
									borderWidth="1px"
									borderRadius="md"
									borderColor={borderColor}
								>
									<Detail label="Name" value={customerName} color={textColor} />
									<Detail label="Email" value={data?.clientEmail} color={textColor} />
									<Detail label="Phone" value={data?.clientPhoneNumber} color={textColor} />
									<Detail label="Preferred contact" value={data?.clientModeOfContact} color={textColor} />
									<Detail label="Client ID" value={data?.clientId} color={textColor} />
								</SimpleGrid>
							</Box>
						)}
						{leadRows.length > 0 && (
							<Box>
								<FormLabel fontSize="sm" color={subTextColor}>
									Lead details
								</FormLabel>
								<SimpleGrid
									columns={{ base: 1, sm: 2 }}
									spacing={3}
									p={3}
									borderWidth="1px"
									borderRadius="md"
									borderColor={borderColor}
								>
									{leadRows.map(({ key, label }) => (
										<Detail key={key} label={label} value={showValue(lead[key])} color={textColor} />
									))}
								</SimpleGrid>
							</Box>
						)}
						<Box>
							<FormLabel fontSize="sm" color={subTextColor}>
								Description
							</FormLabel>
							<Box
								p={4}
								bg={descriptionBg}
								borderRadius="md"
								borderWidth="1px"
								borderColor={borderColor}
								minH="150px"
							>
								<Text whiteSpace="pre-wrap" color={textColor}>
									{data?.issue || "No description provided."}
								</Text>
							</Box>
						</Box>

						{data?.originalname && (
							<Box>
								<FormLabel fontSize="sm" color={subTextColor}>
									Attachment
								</FormLabel>
								<Flex
									align="center"
									p={3}
									borderWidth="1px"
									borderRadius="md"
									borderColor={borderColor}
								>
									<Icon as={FiFileText} mr={3} fontSize="xl" color="var(--banner_bg)" />
									<Text flex="1" color={textColor} fontWeight="medium" isTruncated>
										{data?.originalname}
									</Text>
									<Tooltip label="Download File" hasArrow>
										<Box
											as="button"
											aria-label="Download file"
											disabled={isDownloading}
											opacity={isDownloading ? 0.5 : 1}
											onClick={() => handleDownload(data?.originalname)}
											p={2}
											borderRadius="md"
											_hover={{ bg: hoverBg }}
										>
											<Icon as={FiDownload} color="var(--banner_bg)" />
										</Box>
									</Tooltip>
								</Flex>
							</Box>
						)}
					</VStack>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default NoteDetails;
