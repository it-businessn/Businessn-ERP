import { Box, Flex, Text, Th } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaSort } from "react-icons/fa";
import LocalStorageService from "services/LocalStorageService";
import ProjectService from "services/ProjectService";
import UserService from "services/UserService";
import { isManager } from "utils";
import WorkviewToolbar from "./WorkviewToolbar";
import ProjectTable from "./project";

export const headerCell = (key, weight, w) => (
	<Th
		w={w}
		fontWeight={weight ? weight : "bolder"}
		key={key}
		fontSize={"xs"}
		p={"0.5em 1em"}
	>
		<Flex alignItems={"center"} gap={0.5}>
			{key}
			<FaSort sx={{ width: "5px" }} />
		</Flex>
	</Th>
);

const WorkView = () => {
	const [projects, setProjects] = useState(null);
	const [refresh, setRefresh] = useState(false);

	const [managers, setManagers] = useState(null);
	const user = LocalStorageService.getItem("user");
	const isManagerView = isManager(user?.role);
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
		const fetchAllProjectInfo = async () => {
			try {
				setProjects(null);
				const response = isManagerView
					? await ProjectService.getAllCompanyProjects(company)
					: await ProjectService.getAllCompanyProjectsByUser(
							user?.fullName,
							company,
					  );
				setProjects(response.data);
			} catch (error) {
				console.error(error);
				setProjects(null);
			}
		};
		fetchAllProjectInfo();
		const fetchAllManagers = async () => {
			try {
				const response = await UserService.getAllManagers(company);
				setManagers(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllManagers();
	}, [refresh, company]);

	// const allProjects = projects?.map((project) => ({
	// 	projectName: project.name,
	// 	id: project._id,
	// }));

	// const allTasks = projects?.flatMap(
	// 	(project) =>
	// 		project?.tasks?.map((task) => ({
	// 			...task,
	// 			projectName: project.name,
	// 		})) || [],
	// );

	// const allProjectTasks = allTasks.map((task) => ({
	// 	taskName: task.taskName,
	// 	id: task._id,
	// }));

	// const allActivities = allTasks?.filter(
	// 	(task) => task?.activities?.length > 0,
	// );
	return (
		<Box p={{ base: "1em", md: "2em" }} mt={{ base: "3em", md: 0 }}>
			<Text fontWeight="bold" mb={"0.5em"}>
				{/* Workview  */}
				Projects Overview
			</Text>
			<WorkviewToolbar />
			<Box
				p="1em"
				bg={"brand.primary_bg"}
				border="2px solid var(--main_color)"
				borderRadius="10px"
				color={"brand.nav_color"}
			>
				{projects && (
					<ProjectTable
						setRefresh={setRefresh}
						projects={projects}
						managers={managers}
						company={company}
					/>
				)}
				{/* {projects && viewMode === "Projects" ? (
					<ProjectTable
						setRefresh={setRefresh}
						data={projects}
						managers={managers}
					/>
				) : viewMode === "Tasks" ? (
					<TaskTable
						allProjects={allProjects}
						allTasks={allTasks}
						allProjectTasks={allProjectTasks}
						allActivities={allActivities}
						setRefresh={setRefresh}
						data={projects}
					/>
				) : (
					// ) : viewMode === "Activities" ? (
					// 	<TaskTable
					// 		allProjects={allProjects}
					// 		allTasks={allTasks}
					// 		allProjectTasks={allProjectTasks}
					// 		allActivities={allActivities}
					// 		setRefresh={setRefresh}
					// 		isFiltered
					// 		data={projects}
					// 	/>
					<></>
				)} */}
			</Box>
		</Box>
	);
};

export default WorkView;
