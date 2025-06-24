import { HStack } from "@chakra-ui/react";
import { useState } from "react";
import EmpSearchMenu from "../company/group-tab/EmpSearchMenu";
import AddNewUser from "./AddNewUser";
import UserList from "./UserList";

const UsersPanel = ({
	employees,
	setFilteredEmployees,
	filteredEmployees,
	setIsRefresh,
	isUser,
	company,
}) => {
	const [empName, setEmpName] = useState("");

	const handleInputChange = (value) => {
		setEmpName(value);
		setFilteredEmployees(
			employees.filter((emp) => emp?.empId?.fullName?.toLowerCase().includes(value.toLowerCase())),
		);
	};
	const [openAddUser, setOpenAddUser] = useState(false);
	const handleSelect = (emp) => {
		setEmpName(emp?.empId?.fullName);
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
				{/* <LeftIconButton
					name={"Add User"}
					handleClick={() => setOpenAddUser(true)}
					icon={<SmallAddIcon />}
				/> */}

				{openAddUser && (
					<AddNewUser
						isOpen={openAddUser}
						onClose={() => setOpenAddUser(false)}
						setRefresh={setIsRefresh}
					/>
				)}
			</HStack>
			<UserList
				isUser={isUser}
				filteredEmployees={filteredEmployees}
				company={company}
				height={"calc(100vh - 250px)"}
			/>
		</>
	);
};

export default UsersPanel;
