import { SmallAddIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Select,
	SimpleGrid,
	Text,
	VStack,
} from "@chakra-ui/react";
import { PRIORITY } from "erp-modules/project-management/workview/project/data";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import SettingService from "services/SettingService";
import UserService from "services/UserService";
import AddNewUser from "./AddNewUser";
import EmpSearchMenu from "./EmpSearchMenu";
import UserList from "./UserList";

const TeamsPanel = () => {
	const [departments, setDepartments] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isRefresh, setIsRefresh] = useState(false);
	const [deptName, setDeptName] = useState("");
	const [deptDescription, setDeptDescription] = useState("");

	useEffect(() => {
		const fetchAllDepartments = async () => {
			try {
				const response = await SettingService.getAllDepartments();
				setDepartments(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllDepartments();
	}, [isRefresh]);

	const handleDepartmentSubmit = async () => {
		setIsSubmitting(true);
		try {
			await SettingService.addDepartment({
				name: deptName,
				description: deptDescription,
			});
			setIsRefresh(true);
			setDeptName("");
			setDeptDescription("");
		} catch (error) {
			console.log("An error occurred while submitting the application.");
		} finally {
			setIsSubmitting(false);
		}
	};
	const [currentTab, setCurrentTab] = useState(0);

	const handleTabChange = (index) => {
		setCurrentTab(index);
	};
	const [employees, setEmployees] = useState(null);
	const [empName, setEmpName] = useState(null);
	const [filteredEmployees, setFilteredEmployees] = useState(null);
	const handleInputChange = (value) => {
		setEmpName(value);
		setFilteredEmployees(
			employees.filter((emp) =>
				emp?.fullName?.toLowerCase().includes(value.toLowerCase()),
			),
		);
	};
	const [openAddUser, setOpenAddUser] = useState(false);
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
		<Box
			p="1em"
			bg={"brand.primary_bg"}
			border="3px solid var(--main_color)"
			borderRadius="10px"
			fontWeight="bold"
		>
			<HStack>
				<FormControl>
					<FormLabel> Team Name</FormLabel>
					<Select
						icon={<FaCaretDown />}
						borderRadius="10px"
						// value={formData.priority}
						placeholder="Select Team Name"
						// onChange={(e) =>
						// 	setFormData((prevData) => ({
						// 		...prevData,
						// 		priority: e.target.value,
						// 	}))
						// }
					>
						{PRIORITY?.map((item) => (
							<option value={item} key={item}>
								{item}
							</option>
						))}
					</Select>
				</FormControl>
				<FormControl>
					<FormLabel> Module Base</FormLabel>
					<Select
						icon={<FaCaretDown />}
						borderRadius="10px"
						// value={formData.priority}
						placeholder="Select Module Base"
						// onChange={(e) =>
						// 	setFormData((prevData) => ({
						// 		...prevData,
						// 		priority: e.target.value,
						// 	}))
						// }
					>
						{PRIORITY?.map((item) => (
							<option value={item} key={item}>
								{item}
							</option>
						))}
					</Select>
				</FormControl>
				<FormControl>
					<FormLabel> Group Admin</FormLabel>
					<Select
						icon={<FaCaretDown />}
						borderRadius="10px"
						// value={formData.priority}
						placeholder="Select Group Admin"
						// onChange={(e) =>
						// 	setFormData((prevData) => ({
						// 		...prevData,
						// 		priority: e.target.value,
						// 	}))
						// }
					>
						{PRIORITY?.map((item) => (
							<option value={item} key={item}>
								{item}
							</option>
						))}
					</Select>
				</FormControl>
			</HStack>
			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				templateColumns={{ lg: "33% 67%" }}
				spacing="1em"
				mt="4"
			>
				<Box
					p="1em"
					bg={"brand.primary_bg"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
					fontWeight="bold"
				>
					<HStack>
						<EmpSearchMenu
							filteredEmployees={filteredEmployees}
							empName={empName}
							handleInputChange={handleInputChange}
							handleSelect={handleSelect}
						/>
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

					<VStack mt={3}>
						<FormControl>
							<FormLabel> Name</FormLabel>
							<Input
								type="text"
								name="timeToComplete"
								// value={formData.timeToComplete}
								// onChange={(e) =>
								// 	setFormData((prevData) => ({
								// 		...prevData,
								// 		timeToComplete: e.target.value,
								// 	}))
								// }
								required
							/>
						</FormControl>
						<FormControl>
							<FormLabel> Role</FormLabel>
							<Input
								type="text"
								name="timeToComplete"
								// value={formData.timeToComplete}
								// onChange={(e) =>
								// 	setFormData((prevData) => ({
								// 		...prevData,
								// 		timeToComplete: e.target.value,
								// 	}))
								// }
								required
							/>
						</FormControl>
						<FormControl>
							<FormLabel> Email</FormLabel>
							<Input
								type="text"
								name="timeToComplete"
								// value={formData.timeToComplete}
								// onChange={(e) =>
								// 	setFormData((prevData) => ({
								// 		...prevData,
								// 		timeToComplete: e.target.value,
								// 	}))
								// }
								required
							/>
						</FormControl>
					</VStack>
				</Box>
				<Box
					p="1em"
					bg={"brand.primary_bg"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
				>
					<Text fontWeight="bold">{employees?.length} Users</Text>

					{employees && (
						<Box w={"100%"} p={0} overflow={"auto"} fontWeight="normal">
							<UserList filteredEmployees={employees} />
						</Box>
					)}
				</Box>
			</SimpleGrid>
		</Box>
	);
};

export default TeamsPanel;
