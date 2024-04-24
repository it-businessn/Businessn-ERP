import { Box, HStack, Icon, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { GoDash } from "react-icons/go";
import { RxDropdownMenu } from "react-icons/rx";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";
import EmployeeDragFromQuickSelection from "./EmployeeDragFromQuickSelection";
import HeaderCards from "./HeaderCards";
import SchedulingCalendar from "./SchedulingCalendar";

const ScheduleWorkView = () => {
	const [employees, setEmployees] = useState(null);
	const [isExpandedIndex, setIsExpandedIndex] = useState(null);
	const [isExpanded, setIsExpanded] = useState(false);
	const [newEmployeeAdded, setNewEmployeeAdded] = useState(null);
	const userId = LocalStorageService.getItem("user")._id;

	useEffect(() => {
		const getRandomColor = (index) => {
			const colors = [
				"var(--primary_button_bg)",
				"var(--correct_ans)",
				"var(--almost_pass)",
				"var(--event_color)",
				"var(--incorrect_ans)",
			];
			// var randomIndex = Math.floor(Math.random() * colors.length);
			return colors[index];
		};
		const fetchAllEmployeeByRole = async () => {
			try {
				const response = await UserService.getAllEmployeesByRole();
				response.data.forEach((user, index) => {
					user.color = getRandomColor(index);
					return user;
				});
				setEmployees(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchAllEmployeeByRole();
	}, []);
	const addEmployee = (employee, color) => {
		setNewEmployeeAdded({
			id: employee.id,
			name: employee.fullName,
			color,
		});
	};
	return (
		<Box p={{ base: "1em" }} overflow={"hidden"}>
			<Text fontWeight="bold" mb={"0.5em"}>
				WorkView
			</Text>
			<SimpleGrid
				mb={"1em"}
				columns={{ base: 1, md: 3 }}
				spacing="1em"
				color={"brand.200"}
			>
				<HeaderCards />
			</SimpleGrid>
			<DndProvider backend={HTML5Backend}>
				<SimpleGrid
					columns={{ base: 1, md: 1, lg: 2 }}
					spacing="4"
					mt="4"
					templateColumns={{ lg: "30% 70%" }}
				>
					<Box
						p="1em"
						bg={"brand.primary_bg"}
						border="3px solid var(--main_color)"
						borderRadius="10px"
						fontWeight="bold"
					>
						<Text fontWeight="bold" color={"brand.600"}>
							Quick Selections
						</Text>
						<Text color={"brand.600"}>Role</Text>
						{employees?.map((employee) => (
							<VStack key={employee._id} w={"100%"} alignItems={"self-start"}>
								<HStack>
									<Icon as={RxDropdownMenu} boxSize={8} />

									<Text fontWeight="bold" fontSize={"sm"} mb={"0.5em"}>
										{employee._id}
									</Text>
								</HStack>
								{employee.employees.map((emp, index) => (
									<React.Fragment key={emp.id}>
										<EmployeeDragFromQuickSelection
											employee={emp}
											color={employee.color}
											index={index}
											isExpanded={isExpanded}
											setIsExpandedIndex={setIsExpandedIndex}
											setIsExpanded={setIsExpanded}
											sendEmployee={addEmployee}
										/>
										{isExpanded &&
											isExpandedIndex === index &&
											emp.tasks?.map((task, index) => (
												<HStack
													key={task.taskName + index}
													w={"100%"}
													ml={"2em"}
													p={0}
												>
													<Icon as={GoDash} boxSize={5} />
													<Text
														overflow={"hidden"}
														whiteSpace={"nowrap"}
														textOverflow={"ellipsis"}
														fontSize={"sm"}
														fontWeight={"normal"}
													>
														{task?.taskName}
													</Text>
												</HStack>
											))}
									</React.Fragment>
								))}
							</VStack>
						))}
					</Box>
					<Box
						p="1em"
						bg={"brand.primary_bg"}
						border="3px solid var(--main_color)"
						borderRadius="10px"
						fontWeight="bold"
					>
						Location 1
						<SchedulingCalendar newEmployeeAdded={newEmployeeAdded} />
					</Box>
				</SimpleGrid>
			</DndProvider>
		</Box>
	);
};

export default ScheduleWorkView;
