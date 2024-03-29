import { DeleteIcon } from "@chakra-ui/icons";
import { Button, HStack, Text, Tooltip } from "@chakra-ui/react";
import { AddTaskButton, TaskButton, generateLighterShade } from "utils";
import { COLORS } from "../data";

const ActionItem = ({
	name,
	totalTasks,
	handleEditProject,
	handleAddTask,
	handleToggle,
	totalTask,
	isInner,
	isExpanded,
	handleDelete,
	isProject,
	data,
	type,
	setRefresh,
}) => {
	return (
		<>
			<Tooltip label={name} fontSize="xs" hasArrow>
				<Text
					overflow={"hidden"}
					whiteSpace={"nowrap"}
					textOverflow={"ellipsis"}
					w={"160px"}
					mt={"-1em"}
				>
					{name}
				</Text>
			</Tooltip>

			<HStack
				mt={"-1em"}
				spacing={2}
				cursor={totalTask?.length > 0 ? "pointer" : "default"}
			>
				{totalTask?.length > 0 && (
					<TaskButton
						isExpanded={isExpanded}
						totalTasks={totalTasks}
						onClick={handleToggle}
					/>
				)}
				<AddTaskButton
					onClick={handleAddTask}
					handleClick={handleEditProject}
					isInner={isInner}
					data={data}
					type={type}
					setRefresh={setRefresh}
				/>
				{!isProject && (
					<Button
						onClick={handleDelete}
						size="xxs"
						display={"flex"}
						variant="ghost"
						fontWeight={"bold"}
						color="brand.nav_color"
						_hover={{
							bg: generateLighterShade(COLORS.primary, 0.8),
							color: "brand.nav_color",
						}}
					>
						<DeleteIcon />
					</Button>
				)}
			</HStack>
		</>
	);
};

export default ActionItem;
