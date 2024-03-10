import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Flex,
	HStack,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	Spacer,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import Loader from "components/Loader";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { PiUserSquareBold } from "react-icons/pi";
import { RiMore2Fill } from "react-icons/ri";
import { useBreakpointValue } from "services/Breakpoint";
import ContactService from "services/ContactService";
import { generateLighterShade } from "utils";

const Customers = () => {
	const { isMobile } = useBreakpointValue();
	const [contacts, setContacts] = useState(null);
	const fetchAllContacts = async () => {
		try {
			const response = await ContactService.getContacts();
			response.data.map((item) => (item.comm = "Meeting"));
			setContacts(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchAllContacts();
	}, []);

	return (
		<Box p={{ base: "1em", md: "2em" }}>
			<Text fontWeight="bold" mb={"0.5em"}>
				Customers
			</Text>
			<Box
				p="1em"
				bg={"brand.primary_bg"}
				border="2px solid var(--main_color)"
				borderRadius="10px"
				color={"brand.nav_color"}
			>
				{isMobile ? (
					<Flex flexDir="column">
						<Flex justify="space-between">
							<Text fontWeight="bold">Customers</Text>
							<Button
								bg="var(--primary_button_bg)"
								size="xs"
								color={"brand.primary_bg"}
								variant={"solid"}
								_hover={{ color: "brand.600" }}
								borderRadius={"10px"}
							>
								Add new customer
							</Button>
						</Flex>
						<HStack spacing="1em" mt="1em">
							<Button
								color={"brand.nav_color"}
								leftIcon={<MdOutlineFilterList />}
								border={"2px solid var(--filter_border_color)"}
								borderRadius={"10px"}
								variant={"ghost"}
								_hover={{ color: "brand.600", bg: "transparent" }}
							>
								Filter
							</Button>
							<InputGroup
								borderRadius={"10px"}
								border={"1px solid var(--filter_border_color)"}
								fontSize="sm"
								fontWeight="bold"
							>
								<InputLeftElement children={<FaSearch />} />
								<Input
									_placeholder={{
										color: "brand.nav_color",
										fontSize: "sm",
									}}
									color={"brand.nav_color"}
									bg={"brand.primary_bg"}
									type="text"
									placeholder="Search here"
									pr="4.5rem"
								/>
							</InputGroup>
						</HStack>
					</Flex>
				) : (
					<Flex>
						<Text fontWeight="bold">Customers</Text>
						<Spacer />
						<HStack w={{ lg: "50%" }} spacing={3} justify={"flex-end"}>
							<Button
								color={"brand.nav_color"}
								size="xs"
								leftIcon={<MdOutlineFilterList />}
								border={"2px solid var(--filter_border_color)"}
								borderRadius={"10px"}
								variant={"ghost"}
								_hover={{ color: "brand.600", bg: "transparent" }}
								ml={2}
							>
								Filter
							</Button>
							<InputGroup
								size="xs"
								w={"40%"}
								borderRadius={"10px"}
								border={"1px solid var(--filter_border_color)"}
								fontSize="xs"
								fontWeight="bold"
							>
								<InputLeftElement size="xs" children={<FaSearch />} />
								<Input
									size="xs"
									_placeholder={{
										color: "brand.nav_color",
										fontSize: "sm",
									}}
									color={"brand.nav_color"}
									bg={"brand.primary_bg"}
									type="text"
									placeholder="Search here"
									pr="4.5rem"
									py={"1.1em"}
								/>
							</InputGroup>
							<Button
								bg="var(--primary_button_bg)"
								size="xs"
								color={"brand.primary_bg"}
								variant={"solid"}
								_hover={{ color: "brand.600" }}
								borderRadius={"10px"}
							>
								Add new customer
							</Button>
						</HStack>
					</Flex>
				)}
				{!contacts && <Loader />}
				{contacts && (
					<Box overflow="auto">
						<Table color={"brand.nav_color"} bg={"brand.primary_bg"}>
							<Thead>
								<Tr>
									<Th fontWeight={"bolder"} p={0}>
										Customer name
									</Th>
									<Th fontWeight={"bolder"}>Company </Th>
									<Th fontWeight={"bolder"}>Email</Th>
									<Th fontWeight={"bolder"}>Communication History</Th>
									<Th></Th>
									<Th></Th>
								</Tr>
							</Thead>
							<Tbody color={"brand.nav_color"}>
								{contacts.map((contact, index) => (
									<Tr key={contact._id}>
										<Td fontSize={"xs"} p={0}>
											{`${contact.firstName} ${contact.lastName}`}
										</Td>
										<Td fontSize={"xs"}>{contact.companyName}</Td>
										<Td fontSize={"xs"}>{contact.email}</Td>
										<Td fontSize={"xs"}>
											<Flex align="center">
												<HStack
													bg={generateLighterShade("#5e51c5", 0.8)}
													color={"#5e51c5"}
													px={2}
													borderRadius={"10px"}
												>
													<Icon as={PiUserSquareBold} />
													<Text>{contact.comm}</Text>
												</HStack>
											</Flex>
										</Td>
										<Td fontSize={"xs"}>
											<HStack>
												<Button
													bgGradient="linear-gradient(58deg, rgb(115 70 236) 0%, rgb(136 107 217) 43%, rgb(50 240 218) 100%)"
													bgClip="text"
													size={"xxs"}
													rightIcon={
														<IconButton
															icon={<ArrowForwardIcon />}
															borderRadius="full"
															color="purple.500"
															bg={"#dedaf4"}
															p={"0.4em"}
															size={"xxs"}
															_hover={{ bg: "#8385d5", color: "brand.100" }}
														/>
													}
												>
													See full profile
												</Button>
											</HStack>
										</Td>
										<Td>
											<IconButton
												icon={<RiMore2Fill />}
												size="sm"
												variant="ghost"
												// onClick={() => handleEdit(row.id)}
											/>
										</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default Customers;
