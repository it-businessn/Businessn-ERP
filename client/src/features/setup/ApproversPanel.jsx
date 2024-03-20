import {
	Button,
	Input,
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
import UserService from "services/UserService";

const ApproversPanel = () => {
	const [employees, setEmployees] = useState(null);
	const [approvers, setManagers] = useState(null);
	const [filteredApprovers, setFilteredManagers] = useState(null);

	const [newApprover, setNewManager] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		const fetchAllEmployees = async () => {
			try {
				const response = await UserService.getAllUsers();
				setEmployees(response.data);
				setFilteredManagers(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllEmployees();
	}, []);

	useEffect(() => {
		const fetchAllManagers = async () => {
			try {
				const response = await UserService.getAllManagers();
				setManagers(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllManagers();
	}, [isSubmitting]);

	const handleManagerInputChange = (value) => {
		setNewManager(value);
		setFilteredManagers(
			approvers.filter((manager) =>
				manager?.fullName?.toLowerCase().includes(value.toLowerCase()),
			),
		);
	};

	const handleManagerSelect = (selectedManager) => {
		setNewManager(selectedManager);
		setFilteredManagers([]);
		handleManagerSubmit(selectedManager);
	};

	const handleManagerSubmit = async (selectedManager) => {
		setIsSubmitting(true);
		try {
			await UserService.updateUserProfile(
				{ role: "Manager" },
				selectedManager._id,
			);
			setNewManager("");
		} catch (error) {
			console.log("An error occurred while submitting the application.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<Menu>
				<MenuButton
					as={Button}
					borderRadius={"10px"}
					bg={"var(--primary_button_bg)"}
				>
					Add Approver
				</MenuButton>
				<MenuList>
					<Input
						placeholder="Enter Approver Name"
						value={newApprover?.fullName}
						onChange={(e) => handleManagerInputChange(e.target.value)}
						mb={2}
					/>
					{filteredApprovers?.map((approver) => (
						<MenuItem
							key={approver._id}
							onClick={() => handleManagerSelect(approver)}
						>
							{approver.fullName}
						</MenuItem>
					))}
				</MenuList>
			</Menu>
			{approvers && (
				<Table variant="simple">
					<Thead>
						<Tr>
							<Th>Name</Th>
							<Th>Email</Th>
							<Th>Department</Th>
						</Tr>
					</Thead>
					<Tbody>
						{approvers.map((approver) => (
							<Tr key={approver._id}>
								<Td>{approver.fullName}</Td>
								<Td>{approver.email}</Td>
								<Td>{approver.department}</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			)}
		</>
	);
};

export default ApproversPanel;
