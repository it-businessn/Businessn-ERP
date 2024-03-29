import { SmallAddIcon } from "@chakra-ui/icons";
import { Button, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import UserService from "services/UserService";
import AddNewUser from "./AddNewUser";
import EmpSearchMenu from "./EmpSearchMenu";
import UserList from "./UserList";

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
			{employees && <UserList filteredEmployees={filteredEmployees} />}
		</>
	);
};

export default UsersPanel;
