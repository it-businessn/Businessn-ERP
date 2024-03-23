import { Td, VStack } from "@chakra-ui/react";
import { formatDate, formatDateTime } from "utils";

const DateCell = ({
	date,
	project,
	index,
	expandedIndex,
	isExpanded,
	isSubExpanded,
}) => {
	const FormattedDate = ({ date }) => <>{formatDate(date)}</>;
	return (
		<Td fontSize={"xs"} p={"1em"} w={"150px"}>
			<VStack alignItems="start" spacing={7}>
				{project[date] ? (
					<FormattedDate date={project[date]} />
				) : (
					formatDate(new Date())
				)}
				{expandedIndex === index &&
					project?.tasks?.map((task, task_index) => (
						<VStack alignItems="start" spacing={7}>
							{task[date] ? (
								<FormattedDate date={task[date]} />
							) : (
								formatDate(new Date())
							)}
							{isExpanded === task_index &&
								task?.subtasks?.length > 0 &&
								task?.subtasks?.map((subtask, subtask_index) => (
									<VStack alignItems="start" spacing={7}>
										{subtask[date] ? (
											<FormattedDate date={subtask[date]} />
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
