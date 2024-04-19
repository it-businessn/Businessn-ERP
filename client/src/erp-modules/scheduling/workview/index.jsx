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
	// const [width, setWidth] = useState(200); // Initial width of the button
	// const [isResizing, setIsResizing] = useState(false);
	// const [isTouchpad, setIsTouchpad] = useState(false);

	// useEffect(() => {
	// 	const handleResize = (e) => {
	// 		if (isResizing) {
	// 			const movementX = isTouchpad
	// 				? e.changedTouches[0].clientX - e.touches[0].clientX
	// 				: e.movementX;
	// 			setWidth((prevWidth) => prevWidth + movementX);
	// 		}
	// 	};

	// 	const handleEndResize = () => {
	// 		setIsResizing(false);
	// 		setIsTouchpad(false);
	// 	};

	// 	document.addEventListener("mousemove", handleResize);
	// 	document.addEventListener("touchmove", handleResize);
	// 	document.addEventListener("mouseup", handleEndResize);
	// 	document.addEventListener("touchend", handleEndResize);

	// 	return () => {
	// 		document.removeEventListener("mousemove", handleResize);
	// 		document.removeEventListener("touchmove", handleResize);
	// 		document.removeEventListener("mouseup", handleEndResize);
	// 		document.removeEventListener("touchend", handleEndResize);
	// 	};
	// }, [isResizing, isTouchpad]);

	// const handleStartResize = (e) => {
	// 	setIsResizing(true);
	// 	setIsTouchpad(e.type.startsWith("touch"));
	// };
	return (
		<Box p={{ base: "1em" }} overflow={"hidden"}>
			<Text fontWeight="bold" mb={"0.5em"}>
				WorkView
			</Text>
			{/* <Box
				as="button"
				bg="blue.500"
				color="white"
				p={4}
				w={width}
				onMouseDown={handleStartResize}
				onTouchStart={handleStartResize}
				_focus={{ outline: "none", color: "red", bg: "blue.500" }}
			>
				Resize Me
			</Box> */}
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
						Location 1 <SchedulingCalendar />
					</Box>
				</SimpleGrid>
			</DndProvider>
		</Box>
	);
};

export default ScheduleWorkView;
