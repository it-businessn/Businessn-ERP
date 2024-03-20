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

const ManagersPanel = () => {
	const [employees, setEmployees] = useState(null);
	const [managers, setManagers] = useState(null);
	const [filteredManagers, setFilteredManagers] = useState(null);

	const [newManager, setNewManager] = useState("");
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

	const deleteManager = (id) => {
		setManagers(managers.filter((manager) => manager.id !== id));
	};
	const handleManagerInputChange = (value) => {
		setNewManager(value);
		setFilteredManagers(
			managers.filter((manager) =>
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
				{ role: "Project Manager" },
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
					Add Manager
				</MenuButton>
				<MenuList>
					<Input
						placeholder="Enter Manager Name"
						value={newManager?.fullName}
						onChange={(e) => handleManagerInputChange(e.target.value)}
						mb={2}
					/>
					{filteredManagers?.map((manager) => (
						<MenuItem
							key={manager._id}
							onClick={() => handleManagerSelect(manager)}
						>
							{manager.fullName}
						</MenuItem>
					))}
				</MenuList>
			</Menu>
			{managers && (
				<Table variant="simple">
					<Thead>
						<Tr>
							<Th>Name</Th>
							<Th>Email</Th>
							<Th>Department</Th>
							{/* <Th>Action</Th> */}
						</Tr>
					</Thead>
					<Tbody>
						{managers.map((manager) => (
							<Tr key={manager._id}>
								<Td>{manager.fullName}</Td>
								<Td>{manager.email}</Td>
								<Td>{manager.department}</Td>
								{/* <Td>
                        <HStack>
                            <Button
                                size="sm"
                                colorScheme="green"
                                onClick={() => deleteManager(manager.id)}
                            >
                                Edit
                            </Button>
                            <Button
                                size="sm"
                                colorScheme="red"
                                onClick={() => deleteManager(manager.id)}
                            >
                                Remove
                            </Button>
                        </HStack>
                    </Td> */}
							</Tr>
						))}
					</Tbody>
				</Table>
			)}
		</>
	);
};

export default ManagersPanel;
