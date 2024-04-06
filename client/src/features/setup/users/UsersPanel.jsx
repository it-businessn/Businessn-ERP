import { SmallAddIcon } from "@chakra-ui/icons";
import { Button, HStack } from "@chakra-ui/react";
import Loader from "components/Loader";
import { useState } from "react";
import AddNewUser from "../AddNewUser";
import EmpSearchMenu from "../EmpSearchMenu";
import UserList from "../UserList";

const UsersPanel = ({
	employees,
	setFilteredEmployees,
	filteredEmployees,
	setIsRefresh,
}) => {
	const [empName, setEmpName] = useState(null);

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
		setEmpName(emp.fullName);
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
			{!employees && <Loader isAuto />}
			{employees && <UserList filteredEmployees={filteredEmployees} />}
		</>
	);
};

export default UsersPanel;
