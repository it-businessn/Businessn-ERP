import {
	HStack,
	Input,
	InputGroup,
	InputRightElement,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import { SIDEBAR_MENU } from "components/sidebar/data";
import { useEffect, useState } from "react";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { GoCheckCircleFill } from "react-icons/go";
import { IoMdCloseCircle } from "react-icons/io";
import UserService from "services/UserService";

const PermissionsPanel = () => {
	const [employees, setEmployees] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isRefresh, setIsRefresh] = useState(false);
	const [empName, setEmpName] = useState(null);
	const [filteredEmployees, setFilteredEmployees] = useState(null);

	useEffect(() => {
		const fetchAllEmployees = async () => {
			try {
				const response = await UserService.getAllUsers();
				setEmployees(response.data);
				setFilteredEmployees(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllEmployees();
	}, [isRefresh]);

	const handleSubmit = () => {
		// setIsSubmitting(true);
		// try {
		// 	await SettingService.addDepartment({
		// 		name: empName,
		// 		description: deptDescription,
		// 	});
		// 	setIsRefresh(true);
		// 	setEmpName("");
		// 	setDeptDescription("");
		// } catch (error) {
		// 	console.log("An error occurred while submitting the application.");
		// } finally {
		// 	setIsSubmitting(false);
		// }
	};
	const handleInputChange = (value) => {
		setEmpName(value);
		setFilteredEmployees(
			employees.filter((emp) =>
				emp?.fullName?.toLowerCase().includes(value.toLowerCase()),
			),
		);
	};
	const [openAddUser, setOpenAddUser] = useState(false);
	const handleSelect = (emp) => {
		console.log(emp);
		setEmpName(emp.fullName);
		// setFilteredEmployees(
		// 	employees.filter((emp) =>
		// 		emp?.fullName?.toLowerCase().includes(emp.fullName),
		// 	),
		// );
		console.log(filteredEmployees);
		// setFilteredEmployees([]);
		// handleSubmit(emp);
	};
	const [isExpanded, setExpanded] = useState(null);
	const [children, setChildren] = useState(null);
	const handleToggle = (index, list) => {
		setExpanded(isExpanded === index ? -1 : index);
		setChildren(list);
	};
	return (
		<>
			<HStack>
				<Menu>
					<MenuButton>
						<InputGroup
							borderRadius={"10px"}
							border={"1px solid var(--filter_border_color)"}
							fontSize="xs"
							fontWeight="bold"
						>
							<Input
								_placeholder={{
									color: "brand.nav_color",
									fontSize: "sm",
								}}
								name="empName"
								value={empName}
								color={"brand.nav_color"}
								bg={"brand.primary_bg"}
								type="text"
								placeholder="Search employee"
								pr="4.5rem"
								py={"1.1em"}
							/>
							<InputRightElement size="xs" children={<FaSearch />} />
						</InputGroup>
					</MenuButton>
					<MenuList>
						<Input
							placeholder="Enter Manager Name"
							value={empName}
							onChange={(e) => handleInputChange(e.target.value)}
							mb={2}
						/>
						{filteredEmployees?.map((emp) => (
							<MenuItem key={emp._id} onClick={() => handleSelect(emp)}>
								{emp.fullName}
							</MenuItem>
						))}
					</MenuList>
				</Menu>
			</HStack>
			{employees && (
				<Table variant="simple">
					<Thead>
						<Tr>
							<Th>Section</Th>
							<Th>Section Access</Th>
							<Th>User Data</Th>
							<Th>Group Data</Th>
							<Th>Region Data</Th>
							<Th>All Data</Th>
							<Th>View</Th>
							<Th>Edit</Th>
							<Th>Delete</Th>
						</Tr>
					</Thead>
					<Tbody>
						{SIDEBAR_MENU.map((menu, index) => (
							<>
								<Tr>
									<Td w={"550px"} key={menu.name}>
										<HStack>
											{menu.children.length > 0 && (
												<FaChevronDown
													onClick={(e) => {
														e.preventDefault();
														handleToggle(index, menu.children);
													}}
												/>
											)}
											<Text>{menu.name}</Text>
										</HStack>
									</Td>
									<Td w={"50px"}>
										<IoMdCloseCircle color={"red"} />
									</Td>
									<Td w={"50px"}>
										<GoCheckCircleFill color={"green"} />
									</Td>
									<Td w={"50px"}>
										<IoMdCloseCircle color={"red"} />
									</Td>
									<Td w={"50px"}>
										<GoCheckCircleFill color={"green"} />
									</Td>
									<Td w={"50px"}>
										<GoCheckCircleFill color={"green"} />
									</Td>
									<Td w={"50px"}>
										<GoCheckCircleFill color={"green"} />
									</Td>
									<Td w={"50px"}>
										<GoCheckCircleFill color={"green"} />
									</Td>
									<Td w={"50px"}>
										<GoCheckCircleFill color={"green"} />
									</Td>
								</Tr>
							</>
						))}
					</Tbody>
				</Table>
			)}
		</>
	);
};

export default PermissionsPanel;
