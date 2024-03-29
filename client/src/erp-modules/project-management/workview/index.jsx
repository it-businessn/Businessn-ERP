import {
	Box,
	Button,
	ButtonGroup,
	Flex,
	HStack,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	Select,
	Spacer,
	Text,
	Th,
} from "@chakra-ui/react";
import Loader from "components/Loader";
import { useEffect, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { FaCaretDown, FaSearch, FaSort } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { MdDateRange } from "react-icons/md";
import ProjectService from "services/ProjectService";
import UserService from "services/UserService";
import { generateLighterShade } from "utils";
import ProjectTable from "./project/ProjectTable";
import { VIEW_MODE } from "./project/data";
import TaskTable from "./task/TaskTable";

export const statusColor = (status) => {
	if (status?.includes("Overdue")) {
		return { color: "red", bg: generateLighterShade("#c1acac", 0.8) };
	} else if (status?.includes("Due Today")) {
		return { color: "green", bg: generateLighterShade("#b1c9b1", 0.8) };
	} else if (status?.includes("Upcoming")) {
		return { color: "blue", bg: generateLighterShade("#d1d2ef", 0.5) };
	} else {
		return { color: "#213622", bg: generateLighterShade("#213622", 0.8) };
	}
};

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
	const [viewMode, setViewMode] = useState(VIEW_MODE[0].name);
	const [projects, setProjects] = useState([]);
	const [refresh, setRefresh] = useState(false);

	const [managers, setManagers] = useState(null);
	useEffect(() => {
		const fetchAllProjectInfo = async () => {
			try {
				const response = await ProjectService.getAllProjects();
				setProjects(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllProjectInfo();
		const fetchAllManagers = async () => {
			try {
				const response = await UserService.getAllManagers();
				setManagers(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllManagers();
	}, [refresh]);

	const switchToView = (name) => setViewMode(name);

	const allProjects = projects?.map((project) => ({
		projectName: project.name,
		id: project._id,
	}));

	const allTasks = projects?.flatMap(
		(project) =>
			project?.tasks?.map((task) => ({
				...task,
				projectName: project.name,
			})) || [],
	);

	const allProjectTasks = allTasks.map((task) => ({
		taskName: task.taskName,
		id: task._id,
	}));

	const allActivities = allTasks?.filter(
		(task) => task?.activities?.length > 0,
	);
	return (
		<Box p={{ base: "1em", md: "2em" }} mt={{ base: "3em", md: 0 }}>
			<Text fontWeight="bold" mb={"0.5em"}>
				{/* Workview  */}
				Projects Overview
			</Text>
			<Flex
				justifyContent={"space-between"}
				gap={{ base: 0, lg: "1.5em" }}
				flexDir={{ base: "column", lg: "row" }}
			>
				<Box mb={4} bg={"var(--main_color)"} borderRadius={"1em"} px="5px">
					<ButtonGroup variant="solid" p={0} m={0}>
						{VIEW_MODE.map(({ name, id }) => (
							<Button
								key={id}
								m={"0 !important"}
								onClick={() => switchToView(name)}
								color={viewMode === name ? "brand.100" : "brand.nav_color"}
								bg={
									viewMode === name
										? "var(--primary_button_bg)"
										: "var(--main_color)"
								}
								borderRadius={"1em"}
								size={"sm"}
								variant={"solid"}
								fontWeight={viewMode === name ? "bold" : "normal"}
								_hover={{ bg: "transparent", color: "brand.600" }}
							>
								{name}
							</Button>
						))}
					</ButtonGroup>
				</Box>
				<Spacer />
				<Box>
					<InputGroup
						borderRadius={"1em"}
						border={"1px solid var(--filter_border_color)"}
						fontWeight="bold"
					>
						<InputLeftElement size="xs" children={<FaSearch />} />
						<Input
							borderRadius={"1em"}
							_placeholder={{
								color: "brand.nav_color",
								fontSize: "sm",
								verticalAlign: "top",
							}}
							color={"brand.nav_color"}
							bg={"transparent"}
							type="text"
							placeholder="People or owner"
						/>
					</InputGroup>
				</Box>
				<Box my={{ base: "1em", lg: "0" }}>
					<ButtonGroup
						variant="solid"
						isAttached
						p={0}
						m={0}
						borderRadius={"1em"}
						border={"1px solid var(--filter_border_color)"}
					>
						<IconButton
							icon={<AiOutlineUser />}
							borderRadius={"1em"}
							color="purple.100"
							bg={"brand.primary_button_bg"}
							p={"0.4em"}
							_hover={{ bg: "transparent", color: "brand.600" }}
						/>
						<IconButton
							icon={<HiOutlineUserGroup />}
							borderRadius={"1em"}
							color="brand.nav_color"
							p={"0.4em"}
							bg={"transparent"}
							_hover={{ bg: "transparent", color: "brand.600" }}
						/>
					</ButtonGroup>
				</Box>
				<Box mb={{ base: "1em", lg: "0" }}>
					<HStack
						borderRadius={"1em"}
						border={"1px solid var(--filter_border_color)"}
						color="brand.nav_color"
					>
						<Icon as={MdDateRange} boxSize={4} ml={2} />
						<Select fontSize={"sm"} icon={<Icon as={FaCaretDown} />}>
							<option>Last Month</option>
						</Select>
					</HStack>
				</Box>
			</Flex>
			<Box
				p="1em"
				bg={"brand.primary_bg"}
				border="2px solid var(--main_color)"
				borderRadius="10px"
				color={"brand.nav_color"}
			>
				{!projects && <Loader />}
				{projects && viewMode === "Projects" ? (
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
				)}
			</Box>
		</Box>
	);
};

export default WorkView;
