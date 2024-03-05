import { ArrowUpIcon, CopyIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Card,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Icon,
	IconButton,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Select,
	SimpleGrid,
	Stack,
	Text,
	VStack,
	useDisclosure,
} from "@chakra-ui/react";
import { RiEditLine } from "react-icons/ri";

const Pipeline = () => {
	const categories = [
		{ name: "New", color: "#dbe5ff" },
		{ name: "Presentation", color: "#ffe4e1" },
		{ name: "Meeting", color: "#caeaf5" },
		{ name: "Negotiating", color: "lightgrey" },
		{ name: "Won", color: "#c4f7d8" },
	];
	const { isOpen, onOpen, onClose } = useDisclosure();
	const handleSubmit = () => console.log("submit");
	return (
		<Box p={{ base: "1em", md: "2em" }}>
			<Text fontWeight="bold" mb={"0.5em"}>
				Target Leads
			</Text>
			<SimpleGrid
				columns={{ base: 1, md: 2, lg: 5 }}
				spacing="1em"
				color={"brand.200"}
			>
				{categories.map((category) => (
					<Box borderRadius="10px" border="3px solid white" key={category.name}>
						<Box
							fontWeight="bold"
							px="1em"
							bg={category.color}
							borderTopLeftRadius="10px"
							borderTopRightRadius="10px"
						>
							<Flex justify="space-between" align="center">
								<Text fontSize="xs" fontWeight="bold">
									{category.name}
								</Text>
								<Select width="90px" border={"none"} fontSize={"xs"}>
									<option>Weekly</option>
									<option>Last month</option>
								</Select>
							</Flex>
							<Flex align="center" color={"brand.600"} pb="1">
								<Text mr="3">1245</Text>
								<Icon mr="1" as={ArrowUpIcon} color="green.500" />
								<Text color="green.500" fontSize="xs">
									10%
								</Text>
							</Flex>
						</Box>
						<Card m="1em" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
							<VStack
								align="flex-start"
								color={"brand.200"}
								fontSize="xs"
								p={"1em"}
								spacing={0.5}
							>
								<HStack justifyContent={"space-between"} w={"100%"}>
									<Text fontSize="xs" fontWeight="bold">
										Name of Company
									</Text>
									<RiEditLine onClick={onOpen} />
								</HStack>
								<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
									ABC
								</Text>
								<Text fontSize="xs" fontWeight="bold">
									Email
								</Text>
								<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
									abc@gmail.com
									<IconButton
										icon={<CopyIcon />}
										size={"xs"}
										color="brand.600"
									/>
								</Text>
								<Text fontSize="xs" fontWeight="bold">
									Phone
								</Text>
								<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
									+123 456 6778
								</Text>
							</VStack>
						</Card>
						<Card m="1em" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
							<VStack
								align="flex-start"
								color={"brand.200"}
								fontSize="xs"
								p={"1em"}
								spacing={0.5}
							>
								<HStack justifyContent={"space-between"} w={"100%"}>
									<Text fontSize="xs" fontWeight="bold">
										Name of Company
									</Text>
									<RiEditLine onClick={onOpen} />
								</HStack>
								<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
									ABC
								</Text>
								<Text fontSize="xs" fontWeight="bold">
									Email
								</Text>
								<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
									abc@gmail.com
									<IconButton
										icon={<CopyIcon />}
										size={"xs"}
										color="brand.600"
									/>
								</Text>
								<Text fontSize="xs" fontWeight="bold">
									Phone
								</Text>
								<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
									+123 456 6778
								</Text>
							</VStack>
						</Card>
						<Card m="1em" bg={"#eef0fc"} border={"1px solid #e3e5f1"}>
							<VStack
								align="flex-start"
								color={"brand.200"}
								fontSize="xs"
								p={"1em"}
								spacing={0.5}
							>
								<HStack justifyContent={"space-between"} w={"100%"}>
									<Text fontSize="xs" fontWeight="bold">
										Name of Company
									</Text>
									<RiEditLine onClick={onOpen} />
								</HStack>
								<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
									ABC
								</Text>
								<Text fontSize="xs" fontWeight="bold">
									Email
								</Text>
								<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
									abc@gmail.com
									<IconButton
										icon={<CopyIcon />}
										size={"xs"}
										color="brand.600"
									/>
								</Text>
								<Text fontSize="xs" fontWeight="bold">
									Phone
								</Text>
								<Text fontSize="xs" fontWeight="bold" color={"brand.600"}>
									+123 456 6778
								</Text>
							</VStack>
						</Card>
					</Box>
				))}
			</SimpleGrid>
			{/* {record && ( */}
			<Modal isCentered isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Edit Lead</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Stack spacing="5">
							<form onSubmit={handleSubmit}>
								<Stack spacing={4}>
									<FormControl>
										<FormLabel>Name of Company</FormLabel>
										<Input
											type="text"
											name="company"
											// value={formData.email}
											// onChange={handleChange}
											required
										/>
									</FormControl>
									<FormControl>
										<FormLabel>Email</FormLabel>
										<Input
											type="email"
											name="email"
											// value={formData.email}
											// onChange={handleChange}
											required
										/>
									</FormControl>
									<FormControl>
										<FormLabel>Phone</FormLabel>
										<Input
											type="text"
											name="phone"
											// value={formData.email}
											// onChange={handleChange}
											required
										/>
									</FormControl>
									<HStack justifyContent={"end"}>
										<Button
											// isLoading={isLoading}
											type="submit"
											bg="brand.logo_bg"
											// _hover={{ color: "brand.100" }}
										>
											Save
										</Button>
										<Button
											// isLoading={isLoading}
											colorScheme="gray"
										>
											Cancel
										</Button>
									</HStack>
								</Stack>
							</form>
							{/* {error && (
						<Alert status="error" mt={4}>
							<AlertIcon />
							{error}
						</Alert>
					)} */}
						</Stack>
					</ModalBody>
				</ModalContent>
			</Modal>
			{/* )} */}
		</Box>
	);
};

export default Pipeline;
