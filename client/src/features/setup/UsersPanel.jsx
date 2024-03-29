import { SmallAddIcon } from "@chakra-ui/icons";
import {
	Button,
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
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import UserService from "services/UserService";
import AddNewUser from "./AddNewUser";

const UsersPanel = () => {
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

				<Button
					// isDisabled={isDisabled}
					// isLoading={isLoading}
					onClick={() => setOpenAddUser(true)}
					bg={"brand.primary_button_bg"}
					px={{ base: "2em" }}
					color={"brand.primary_bg"}
					_hover={{
						color: "brand.primary_button_bg",
						bg: "brand.700",
						border: "1px solid var(--primary_button_bg)",
					}}
					leftIcon={<SmallAddIcon />}
					type="submit"
					borderRadius={"10px"}
				>
					Add User
				</Button>
				{openAddUser && (
					<AddNewUser
						isOpen={openAddUser}
						onClose={() => setOpenAddUser(false)}
						setRefresh={setIsRefresh}
					/>
				)}
			</HStack>
			{employees && (
				<Table variant="simple">
					<Thead>
						<Tr>
							<Th>Name</Th>
							<Th>Email</Th>
							<Th>Base Module</Th>
							<Th>Team</Th>
							<Th>Role</Th>
						</Tr>
					</Thead>
					{console.log(filteredEmployees)}
					<Tbody>
						{filteredEmployees.map(
							({ fullName, _id, email, baseModule, team, role }) => (
								<Tr key={_id}>
									<Td whiteSpace={"pre-wrap"}>{fullName}</Td>
									<Td whiteSpace={"pre-wrap"}>{email}</Td>
									<Td whiteSpace={"pre-wrap"}>{baseModule || ""}</Td>
									<Td whiteSpace={"pre-wrap"}>{team || ""}</Td>
									<Td whiteSpace={"pre-wrap"}>{role}</Td>
								</Tr>
							),
						)}
					</Tbody>
				</Table>
			)}
		</>
	);
};

export default UsersPanel;
