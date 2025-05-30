import {
	Badge,
	Box,
	Divider,
	Flex,
	FormLabel,
	HStack,
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
	VStack,
} from "@chakra-ui/react";
import { FiDownload, FiFileText } from "react-icons/fi";
import { BASE_URL } from "services";

const NoteDetails = ({ setIsOpen, isOpen, data }) => {
	const bgColor = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.700");
	const textColor = useColorModeValue("gray.700", "gray.300");
	const subTextColor = useColorModeValue("gray.600", "gray.400");
	const descriptionBg = useColorModeValue("gray.50", "gray.700");
	const hoverBg = useColorModeValue("gray.100", "gray.700");

	const handleDownload = (fileName) => {
		const downloadUrl = `${BASE_URL}/ticket/download/${fileName}`;
		window.location.href = downloadUrl;
	};

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
								{data?.topic || ""}
							</Text>
						</HStack>
					</Flex>
				</ModalHeader>
				<ModalCloseButton size="sm" mt={2} mr={2} />
				<Divider my={3} />
				<ModalBody pb={6}>
					<VStack spacing={4} align="stretch">
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
									<Icon as={FiFileText} mr={3} fontSize="xl" color="blue.500" />
									<Text flex="1" color={textColor} fontWeight="medium" isTruncated>
										{data?.originalname}
									</Text>
									<Tooltip label="Download File" hasArrow>
										<Box
											as="button"
											onClick={() => handleDownload(data?.originalname)}
											p={2}
											borderRadius="md"
											_hover={{ bg: hoverBg }}
										>
											<Icon as={FiDownload} color="blue.500" />
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
