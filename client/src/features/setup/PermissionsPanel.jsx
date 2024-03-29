import {
	Box,
	HStack,
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
import { FaChevronDown } from "react-icons/fa";
import { GoCheckCircleFill } from "react-icons/go";
import { IoMdCloseCircle } from "react-icons/io";
import UserService from "services/UserService";
import EmpSearchMenu from "./EmpSearchMenu";

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
				<EmpSearchMenu
					filteredEmployees={filteredEmployees}
					empName={empName}
					handleInputChange={handleInputChange}
					handleSelect={handleSelect}
				/>
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
							<Tr>
								<Td w={"550px"} key={menu.name} py={1}>
									<HStack spacing={2}>
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
									{isExpanded === index &&
										menu.children?.length > 0 &&
										menu.children.map((child) => (
											<Box mt={1.5}>
												<Text>{child.name}</Text>
											</Box>
										))}
								</Td>
								<Td w={"50px"} py={1}>
									<IoMdCloseCircle color={"red"} />
									{isExpanded === index &&
										menu.children?.length > 0 &&
										menu.children.map((child) => (
											<Box mt={3}>
												<IoMdCloseCircle color={"red"} />
											</Box>
										))}
								</Td>
								<Td w={"50px"} py={1}>
									<GoCheckCircleFill color={"green"} />
									{isExpanded === index &&
										menu.children?.length > 0 &&
										menu.children.map((child) => (
											<Box mt={3}>
												<IoMdCloseCircle color={"red"} />
											</Box>
										))}
								</Td>
								<Td w={"50px"} py={1}>
									<IoMdCloseCircle color={"red"} />
									{isExpanded === index &&
										menu.children?.length > 0 &&
										menu.children.map((child) => (
											<Box mt={3}>
												<IoMdCloseCircle color={"red"} />
											</Box>
										))}
								</Td>
								<Td w={"50px"} py={1}>
									<GoCheckCircleFill color={"green"} />
									{isExpanded === index &&
										menu.children?.length > 0 &&
										menu.children.map((child) => (
											<Box mt={3}>
												<IoMdCloseCircle color={"red"} />
											</Box>
										))}
								</Td>
								<Td w={"50px"} py={1}>
									<GoCheckCircleFill color={"green"} />
									{isExpanded === index &&
										menu.children?.length > 0 &&
										menu.children.map((child) => (
											<Box mt={3}>
												<IoMdCloseCircle color={"red"} />
											</Box>
										))}
								</Td>
								<Td w={"50px"} py={1}>
									<GoCheckCircleFill color={"green"} />
									{isExpanded === index &&
										menu.children?.length > 0 &&
										menu.children.map((child) => (
											<Box mt={3}>
												<IoMdCloseCircle color={"red"} />
											</Box>
										))}
								</Td>
								<Td w={"50px"} py={1}>
									<GoCheckCircleFill color={"green"} />
									{isExpanded === index &&
										menu.children?.length > 0 &&
										menu.children.map((child) => (
											<Box mt={3}>
												<IoMdCloseCircle color={"red"} />
											</Box>
										))}
								</Td>
								<Td w={"50px"} py={1}>
									<GoCheckCircleFill color={"green"} />
									{isExpanded === index &&
										menu.children?.length > 0 &&
										menu.children.map((child) => (
											<Box mt={3}>
												<IoMdCloseCircle color={"red"} />
											</Box>
										))}
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			)}
		</>
	);
};

export default PermissionsPanel;
