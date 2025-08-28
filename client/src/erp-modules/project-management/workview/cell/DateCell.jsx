import { Td, VStack } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import { getDefaultDate } from "utils/convertDate";

const FormattedDateCell = ({ date }) => <NormalTextTitle mt={0.5} title={getDefaultDate(date)} />;

const DateCell = ({
	file,
	index,
	date,
	expandedIndex,
	isExpanded,
	isTaskExpanded,
	isSubExpanded,
}) => {
	return (
		<Td fontSize={"xs"} w="100%" p={"1em"} display={"flex"} py={0}>
			<VStack alignItems="start">
				{file[date] && <FormattedDateCell date={file[date]} />}

				{expandedIndex === index &&
					file?.projects?.map((project, project_index) => (
						<VStack alignItems="start" key={project._id}>
							{project[date] && <FormattedDateCell date={project[date]} />}

							{isExpanded === project_index &&
								project?.tasks?.length > 0 &&
								project?.tasks?.map((task, task_index) => (
									<VStack alignItems="start" key={task._id}>
										{task[date] && <FormattedDateCell date={task[date]} />}

										{isTaskExpanded === task_index &&
											task?.subtasks?.length > 0 &&
											task?.subtasks?.map((subtask, subtask_index) => (
												<VStack alignItems="start" key={subtask._id}>
													{subtask[date] && <FormattedDateCell date={subtask[date]} />}

													{isSubExpanded === subtask_index &&
														subtask?.subtasks?.length > 0 &&
														subtask?.subtasks?.map((grandSubtask, grand_subtask_index) => (
															<VStack
																alignItems="start"
																key={`grand_subtask_id_*${grand_subtask_index}_${subtask._id}`}
															>
																{grandSubtask[date] && (
																	<FormattedDateCell date={grandSubtask[date]} />
																)}
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
