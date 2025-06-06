import { Box, Flex, Th } from "@chakra-ui/react";

import useCompany from "hooks/useCompany";
import useManager from "hooks/useManager";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { FaSort } from "react-icons/fa";
import LocalStorageService from "services/LocalStorageService";
import ProjectService from "services/ProjectService";
import { isManager } from "utils";
import WorkviewToolbar from "./WorkviewToolbar";
import ProjectTable from "./project";

export const headerCell = (key, weight, w) => (
	<Th w={w} fontWeight={weight ? weight : "bolder"} key={key} fontSize={"xs"} p={"0.5em 1em"}>
		<Flex alignItems={"center"} gap={0.5}>
			{key}
			<FaSort sx={{ width: "5px" }} />
		</Flex>
	</Th>
);

const WorkView = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const loggedInUser = LocalStorageService.getItem("user");
	const [projects, setProjects] = useState(null);
	const [refresh, setRefresh] = useState(false);

	const managers = useManager(company, refresh, true);
	const isManagerView = isManager(loggedInUser?.role);

	useEffect(() => {
		const fetchAllProjectInfo = async () => {
			try {
				setProjects(null);
				const { data } = isManagerView
					? await ProjectService.getAllCompanyProjects(company)
					: await ProjectService.getAllCompanyProjectsByUser(loggedInUser?.fullName, company);
				setProjects(data);
			} catch (error) {
				console.error(error);
				setProjects(null);
			}
		};
		fetchAllProjectInfo();
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
		<PageLayout title={"Projects Overview"} showBgLayer>
			<WorkviewToolbar />
			<Box
				p="1em"
				bg={"var(--primary_bg)"}
				border="2px solid var(--main_color)"
				borderRadius="10px"
				color={"var(--nav_color)"}
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
		</PageLayout>
	);
};

export default WorkView;
