import {
	Box,
	Button,
	Flex,
	HStack,
	Input,
	InputGroup,
	InputLeftElement,
	Spacer,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import Loader from "components/Loader";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";
import { useBreakpointValue } from "services/Breakpoint";
import UserService from "services/UserService";

const Employees = () => {
	const { isMobile } = useBreakpointValue();
	const [employees, setEmployees] = useState(null);
	const fetchAllEmployees = async () => {
		try {
			const response = await UserService.getAllUsers();
			setEmployees(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchAllEmployees();
	}, []);

	return (
		<Box p={{ base: "1em", md: "2em" }}>
			<TextTitle title={"Employees"} mb={"0.5em"} />
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
							<TextTitle title={"Customers"} />
							{/* <Button
								bg="var(--primary_button_bg)"
								size="xs"
								color={"brand.primary_bg"}
								variant={"solid"}
								_hover={{ color: "brand.600" }}
								borderRadius={"10px"}
							>
								Add new employee
							</Button> */}
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
						<TextTitle title={"Employees"} />
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
							{/* <Button
								bg="var(--primary_button_bg)"
								size="xs"
								color={"brand.primary_bg"}
								variant={"solid"}
								_hover={{ color: "brand.600" }}
								borderRadius={"10px"}
							>
								Add new employee
							</Button> */}
						</HStack>
					</Flex>
				)}
				{!employees && <Loader />}
				{employees && (
					<Box overflow="auto">
						<Table
							color={"brand.nav_color"}
							bg={"brand.primary_bg"}
							size={"small"}
						>
							<Thead>
								<Tr>
									<Th fontSize={"xs"} fontWeight={"bolder"} p={0}>
										Name
									</Th>
									<Th fontSize={"xs"} fontWeight={"bolder"}>
										Email
									</Th>
									<Th fontSize={"xs"} fontWeight={"bolder"}>
										PhoneNumber
									</Th>
									<Th fontSize={"xs"} fontWeight={"bolder"}>
										Role
									</Th>
									<Th fontSize={"xs"} fontWeight={"bolder"}>
										Manager
									</Th>
								</Tr>
							</Thead>
							<Tbody color={"brand.nav_color"}>
								{employees.map((emp) => (
									<Tr key={emp._id}>
										<Td fontSize={"sm"} p={0}>
											{`${emp.fullName}`}
										</Td>
										<Td fontSize={"sm"}>{emp.email}</Td>
										<Td fontSize={"sm"}>{emp.phoneNumber}</Td>
										<Td fontSize={"sm"}>{emp.role}</Td>
										<Td fontSize={"sm"}>{emp.manager}</Td>
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

export default Employees;
