import { Box, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { GoDash } from "react-icons/go";
import { RxDropdownMenu } from "react-icons/rx";
import UserService from "services/UserService";
import { customOrder, getRoleColor } from "utils";
import EmployeeDragFromQuickSelection from "./EmployeeDragFromQuickSelection";

const QuickSelection = ({ setNewEmployeeAdded }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isExpandedIndex, setIsExpandedIndex] = useState(null);

	const [employees, setEmployees] = useState(null);
	const addEmployee = (employee, color) => {
		setNewEmployeeAdded({
			id: employee.id,
			name: employee.fullName,
			color,
		});
	};

	useEffect(() => {
		const fetchAllEmployeeByRole = async () => {
			try {
				const response = await UserService.getAllEmployeesByRole();
				response.data.forEach((user) => {
					user.color = getRoleColor(user._id);
				});

				const sortedArray = response.data.sort((a, b) => {
					const titleA = a.title;
					const titleB = b.title;
					const indexA = customOrder.indexOf(titleA);
					const indexB = customOrder.indexOf(titleB);
					if (indexA !== -1 && indexB !== -1) {
						return indexA - indexB;
					}

					if (indexA !== -1) {
						return -1;
					}

					if (indexB !== -1) {
						return 1;
					}

					return 0;
				});

				setEmployees(sortedArray);
			} catch (error) {
				console.error(error);
			}
		};

		fetchAllEmployeeByRole();
	}, []);
	return (
		<Box
			p="1em"
			bg={"brand.primary_bg"}
			border="3px solid var(--main_color)"
			borderRadius="10px"
			fontWeight="bold"
		>
			<Text>Quick Selections</Text>
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
	);
};

export default QuickSelection;
