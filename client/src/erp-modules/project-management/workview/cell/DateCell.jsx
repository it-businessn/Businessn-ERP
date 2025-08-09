import { Td, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { formatDate } from "utils/convertDate";

const DateCell = ({ date, project, index, expandedIndex, isExpanded, isSubExpanded }) => {
	const FormattedDate = ({ date, main, task, last }) => (
		<Text
			marginTop={main ? "3em" : "1.75em"}
			/* top={main ? "3em" : task ? "7em" : "8em"} pos={"relative"} */
		>
			{formatDate(date)}
		</Text>
	);
	return (
		<Td fontSize={"xs"} w="100%" p={"1em"} display={"flex"} py={0}>
			<VStack alignItems="start" w={"100%"}>
				{project[date] && <FormattedDate date={project[date]} main />}
				{expandedIndex === index &&
					project?.tasks?.map((task, task_index) => (
						<VStack alignItems="start" w={"100%"} key={task._id}>
							{task[date] ? <FormattedDate date={task[date]} task /> : formatDate(new Date())}
							{isExpanded === task_index &&
								task?.subtasks?.length > 0 &&
								task?.subtasks?.map((subtask, subtask_index) => (
									<VStack alignItems="start" w={"100%"} key={subtask._id}>
										{subtask[date] ? (
											<FormattedDate date={subtask[date]} sub />
										) : (
											formatDate(new Date())
										)}
										{isSubExpanded === subtask_index &&
											subtask?.subtasks?.length > 0 &&
											subtask?.subtasks?.map((item, index) => (
												<React.Fragment key={`start_date_subtask_${item}**${index}`}>
													{/* {item[date]
														? formatDateTime(item[date])
														: formatDate(new Date())} */}
												</React.Fragment>
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
