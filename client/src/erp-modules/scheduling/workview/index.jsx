import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import LocalStorageService from "services/LocalStorageService";
import UserService from "services/UserService";
import { getRoleColor } from "utils";
import HeaderCards from "./HeaderCards";
import QuickSelection from "./quick-selection";
import Scheduler from "./scheduler";

const ScheduleWorkView = () => {
	const [newEmployeeAdded, setNewEmployeeAdded] = useState(null);
	const [employees, setEmployees] = useState(null);
	const [refresh, setRefresh] = useState(null);
	const [company, setCompany] = useState(
		LocalStorageService.getItem("selectedCompany"),
	);

	useEffect(() => {
		const handleSelectedCompanyChange = (event) => setCompany(event.detail);

		document.addEventListener(
			"selectedCompanyChanged",
			handleSelectedCompanyChange,
		);

		return () => {
			document.removeEventListener(
				"selectedCompanyChanged",
				handleSelectedCompanyChange,
			);
		};
	}, []);
	useEffect(() => {
		const fetchAllEmployeeByRole = async () => {
			try {
				const response = await UserService.getAllEmployeesByRole(company);
				response.data.forEach((user) => {
					user.color = getRoleColor(user._id);
				});

				// const sortedArray = response.data.sort((a, b) => {
				// 	const titleA = a.title;
				// 	const titleB = b.title;
				// 	const indexA = customOrder.indexOf(titleA);
				// 	const indexB = customOrder.indexOf(titleB);
				// 	if (indexA !== -1 && indexB !== -1) {
				// 		return indexA - indexB;
				// 	}

				// 	if (indexA !== -1) {
				// 		return -1;
				// 	}

				// 	if (indexB !== -1) {
				// 		return 1;
				// 	}

				// 	return 0;
				// });

				// setEmployees(sortedArray);
				setEmployees(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchAllEmployeeByRole();
	}, [refresh, company]);
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
					<QuickSelection
						employees={employees}
						setNewEmployeeAdded={setNewEmployeeAdded}
					/>
					<Scheduler
						company={company}
						newEmployeeAdded={newEmployeeAdded}
						setRefresh={setRefresh}
					/>
				</SimpleGrid>
			</DndProvider>
		</Box>
	);
};

export default ScheduleWorkView;
