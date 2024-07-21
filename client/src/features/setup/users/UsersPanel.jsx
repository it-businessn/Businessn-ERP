import { SmallAddIcon } from "@chakra-ui/icons";
import { HStack } from "@chakra-ui/react";
import Loader from "components/Loader";
import LeftIconButton from "components/ui/button/LeftIconButton";
import { useState } from "react";
import AddNewUser from "../AddNewUser";
import EmpSearchMenu from "../EmpSearchMenu";
import UserList from "../UserList";

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
				<LeftIconButton
					name={"Add User"}
					handleClick={() => setOpenAddUser(true)}
					icon={<SmallAddIcon />}
				/>

				{openAddUser && (
					<AddNewUser
						isOpen={openAddUser}
						onClose={() => setOpenAddUser(false)}
						setRefresh={setIsRefresh}
					/>
				)}
			</HStack>
			{!employees && <Loader autoHeight />}
			{employees && (
				<UserList
					isUser={isUser}
					filteredEmployees={filteredEmployees}
					company={company}
				/>
			)}
		</>
	);
};

export default UsersPanel;
