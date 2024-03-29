import { Td, Text, VStack } from "@chakra-ui/react";
import { formatDate, formatDateTime } from "utils";

const DateCell = ({
	date,
	project,
	index,
	expandedIndex,
	isExpanded,
	isSubExpanded,
}) => {
	const FormattedDate = ({ date, main, task }) => (
		<Text
			marginTop={main ? "3em" : "1.75em"}
			/* top={main ? "3em" : task ? "7em" : "8em"} pos={"relative"} */
		>
			{formatDate(date)}
		</Text>
	);
	return (
		<Td fontSize={"xs"} p={"1em"} w={"110px"} display={"flex"} py={0}>
			<VStack alignItems="start" w={"100%"}>
				{project[date] && <FormattedDate date={project[date]} main />}
				{expandedIndex === index &&
					project?.tasks?.map((task, task_index) => (
						<VStack alignItems="start" w={"100%"}>
							{task[date] ? (
								<FormattedDate date={task[date]} task />
							) : (
								formatDate(new Date())
							)}
							{isExpanded === task_index &&
								task?.subtasks?.length > 0 &&
								task?.subtasks?.map((subtask, subtask_index) => (
									<VStack alignItems="start" w={"100%"}>
										{subtask[date] ? (
											<FormattedDate date={subtask[date]} sub />
										) : (
											formatDate(new Date())
										)}
										{isSubExpanded === subtask_index &&
											subtask?.subtasks?.length > 0 &&
											subtask?.subtasks?.map((item) =>
												item[date]
													? formatDateTime(item[date])
													: formatDate(new Date()),
											)}
									</VStack>
								))}
						</VStack>
					))}
			</VStack>
		</Td>
	);
};

export default DateCell;
