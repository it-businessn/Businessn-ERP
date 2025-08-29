import { Box, Td, VStack } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import { getDefaultDate } from "utils/convertDate";

const FormattedDateCell = ({ date }) =>
	date ? <NormalTextTitle h="24px" title={getDefaultDate(date)} /> : <Box height={"24px"} />;

const DateCell = ({
	file,
	index,
	date,
	expandedIndex,
	isExpanded,
	isTaskExpanded,
	isSubExpanded,
	isDashboard,
}) => {
	return (
		<Td fontSize={"xs"} w="100%" p={"1em"} display={"flex"} py={0}>
			<VStack alignItems="start">
				{file[date] && <FormattedDateCell date={file[date]} />}

				{(!isDashboard || expandedIndex === index) &&
					file?.projects?.map((project, project_index) => (
						<VStack alignItems="start" key={project._id}>
							<FormattedDateCell date={project[date]} />

							{(!isDashboard || isExpanded === project_index) &&
								project?.tasks?.length > 0 &&
								project?.tasks?.map((task, task_index) => (
									<VStack alignItems="start" key={task._id}>
										<FormattedDateCell date={task[date]} />

										{(!isDashboard || isTaskExpanded === task_index) &&
											task?.subtasks?.length > 0 &&
											task?.subtasks?.map((subtask, subtask_index) => (
												<VStack alignItems="start" key={subtask._id}>
													<FormattedDateCell date={subtask[date]} />

													{(!isDashboard || isSubExpanded === subtask_index) &&
														subtask?.subtasks?.length > 0 &&
														subtask?.subtasks?.map((grandSubtask, grand_subtask_index) => (
															<VStack
																alignItems="start"
																key={`grand_subtask_id_*${grand_subtask_index}_${subtask._id}`}
															>
																<FormattedDateCell date={grandSubtask[date]} />
															</VStack>
														))}
												</VStack>
											))}
									</VStack>
								))}
						</VStack>
					))}
			</VStack>
		</Td>
	);
};

export default DateCell;
