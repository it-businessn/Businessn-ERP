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
	useDisclosure,
} from "@chakra-ui/react";
import Loader from "features/Loader";
import { useEffect, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { FaCaretDown, FaSearch } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { MdDateRange } from "react-icons/md";
import ProjectService from "services/ProjectService";
import AddNewTask from "./AddNewTask";
import ProjectTable from "./ProjectTable";
import TaskTable from "./TaskTable";

const WorkView = () => {
	const [viewMode, setViewMode] = useState("Task");
	const { isOpen, onOpen, onClose } = useDisclosure();

	const switchToView = (name) => setViewMode(name);
	const [projects, setProjects] = useState([]);
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
	}, []);
	return (
		<Box p={{ base: "1em", md: "2em" }} mt={{ base: "3em", md: 0 }}>
			<Text fontWeight="bold" mb={"0.5em"}>
				Workview
			</Text>
			<Flex
				justifyContent={"space-between"}
				gap={{ base: 0, lg: "1.5em" }}
				flexDir={{ base: "column", lg: "row" }}
			>
				<Box mb={4} bg={"white"} borderRadius={"1em"} px="5px">
					<ButtonGroup variant="solid" p={0} m={0}>
						{["Task", "Project", "Activity"].map((name) => (
							<Button
								m={"0 !important"}
								onClick={() => switchToView(name)}
								color={viewMode === name ? "brand.100" : "brand.nav_color"}
								bg={viewMode === name ? "brand.primary_button_bg" : "#fff"}
								borderRadius={"1em"}
								size={"sm"}
								variant={"solid"}
								fontWeight={viewMode === name ? "bold" : "normal"}
								_hover={{ bg: "transparent", color: "brand.600" }}
							>
								{name} View
							</Button>
						))}
					</ButtonGroup>
				</Box>
				<Spacer />
				<Box>
					<InputGroup
						borderRadius={"1em"}
						border={"1px solid #d3d3d3"}
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
						border={"1px solid #d3d3d3"}
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
						border={"1px solid #d3d3d3"}
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
				p="2em"
				bg={"brand.primary_bg"}
				border="2px solid white"
				borderRadius="10px"
				color={"brand.nav_color"}
			>
				<Flex>
					<Text fontWeight="bold">Tasks</Text>
					<Spacer />
					<Button
						onClick={onOpen}
						// leftIcon={<Icon as={SmallAddIcon} />}
						color={"brand.100"}
						bg={"brand.primary_button_bg"}
						borderRadius={"8px"}
						size={"sm"}
						px={"2em"}
					>
						Add new task
					</Button>
				</Flex>
				{!projects && <Loader />}
				{projects && viewMode === "Task" ? (
					<TaskTable data={projects} />
				) : viewMode === "Project" ? (
					<ProjectTable data={projects} />
				) : viewMode === "Activity" ? (
					<TaskTable
						data={projects.filter((task) => task.todoItems.length > 0)}
					/>
				) : (
					<></>
				)}
			</Box>
			<AddNewTask isOpen={isOpen} onClose={onClose} />
		</Box>
	);
};

export default WorkView;
