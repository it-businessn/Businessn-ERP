import { Button, Flex, Spacer, useDisclosure } from "@chakra-ui/react";
import SkeletonLoader from "components/SkeletonLoader";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import ProjectService from "services/ProjectService";
import { isNotEnrollerOrEmployee } from "utils";
import AddFile from "./AddFile";
import FilesOverView from "./FilesOverView";

export const ACTION = {
	ADD: "A",
	EDIT: "E",
	DELETE: "D",
};

const FilesList = ({ managers, company, isDashboard }) => {
	const loggedInUser = LocalStorageService.getItem("user");

	const { isOpen, onOpen, onClose } = useDisclosure();

	const [files, setFiles] = useState(null);
	const [isDataLoaded, setIsDataLoaded] = useState(false);

	useEffect(() => {
		setIsDataLoaded(false);
		const fetchAllFiles = async () => {
			try {
				const { data } = isNotEnrollerOrEmployee(loggedInUser?.role)
					? await ProjectService.getAllCompanyFiles(company)
					: await ProjectService.getAllCompanyFilesByAssignee(loggedInUser?.fullName, company);
				setFiles(data);
			} catch (error) {
				console.error(error);
			}
			setIsDataLoaded(true);
		};
		fetchAllFiles();
	}, []);

	const handleInnerSubTaskUpdate = (subTaskData, fileId, action, subTaskId, deleteIndex) => {
		const updatedData = files?.map((file) =>
			file._id === fileId
				? {
						...file,
						projects: file.projects?.map((project) => {
							return project._id === subTaskData.projectId
								? {
										...project,
										tasks: project.tasks?.map((task) =>
											task._id === subTaskData.taskId
												? {
														...task,
														subtasks: task.subtasks?.map((subtask) =>
															subtask._id === subTaskId
																? {
																		...subtask,
																		subtasks:
																			action === ACTION.DELETE
																				? subtask.subtasks?.filter(
																						(subtask, index) => index !== deleteIndex,
																				  )
																				: subTaskData.subtasks,
																  }
																: subtask,
														),
												  }
												: task,
										),
								  }
								: project;
						}),
				  }
				: file,
		);
		setFiles(updatedData);
	};

	const handleSubTaskUpdate = (subTaskData, fileId, action) => {
		const {
			taskName,
			completed,
			dueDate,
			isOpen,
			priority,
			selectedAssignees,
			selectedAssigneesId,
			status,
			notes,
		} = subTaskData;

		const updatedData = files?.map((file) =>
			file._id === fileId
				? {
						...file,
						projects: file.projects?.map((project) => {
							return project._id === subTaskData.projectId
								? {
										...project,
										tasks: project.tasks?.map((task) =>
											task._id === subTaskData.taskId
												? {
														...task,
														subtasks:
															action === ACTION.ADD
																? [...(task.subtasks || []), subTaskData]
																: action === ACTION.EDIT
																? task.subtasks?.map((subtask) =>
																		subtask._id === subTaskData._id
																			? {
																					...subtask,
																					taskName,
																					completed,
																					dueDate,
																					isOpen,
																					priority,
																					selectedAssignees,
																					selectedAssigneesId,
																					status,
																					notes,
																			  }
																			: subtask,
																  )
																: action === ACTION.DELETE
																? task.subtasks?.filter(
																		(subtask) => subtask._id !== subTaskData._id,
																  )
																: task.subtasks,
												  }
												: task,
										),
								  }
								: project;
						}),
				  }
				: file,
		);
		setFiles(updatedData);
	};

	const handleTaskUpdate = (taskData, fileId, action) => {
		const {
			taskName,
			completed,
			dueDate,
			isOpen,
			priority,
			selectedAssignees,
			selectedAssigneesId,
			status,
			notes,
		} = taskData;

		const updatedData = files?.map((file) =>
			file._id === fileId
				? {
						...file,
						projects: file.projects?.map((project) => {
							return project._id === taskData.projectId
								? {
										...project,
										tasks:
											action === ACTION.ADD
												? [...(project.tasks || []), taskData]
												: action === ACTION.EDIT
												? project.tasks?.map((task) =>
														task._id === taskData._id
															? {
																	...task,
																	taskName,
																	completed,
																	dueDate,
																	isOpen,
																	priority,
																	selectedAssignees,
																	selectedAssigneesId,
																	status,
																	notes,
															  }
															: task,
												  )
												: action === ACTION.DELETE
												? project.tasks?.filter((task) => task._id !== taskData._id)
												: project.tasks,
								  }
								: project;
						}),
				  }
				: file,
		);
		setFiles(updatedData);
	};

	const handleProjectUpdate = (projectData, action) => {
		const {
			projectName,
			selectedAssigneesId,
			notes,
			priority,
			selectedAssignees,
			startDate,
			dueDate,
			status,
		} = projectData;
		const updatedData = files?.map((file) =>
			file._id === projectData.fileId
				? {
						...file,
						projects:
							action == ACTION.ADD
								? [...(file.projects || []), projectData]
								: action == ACTION.DELETE
								? file.projects?.filter((project) => project._id !== projectData._id)
								: file.projects?.map((project) => {
										return project._id === projectData._id
											? {
													...project,
													projectName,
													selectedAssignees,
													selectedAssigneesId,
													priority,
													dueDate,
													notes,
													startDate,
													status,
											  }
											: project;
								  }),
				  }
				: file,
		);
		setFiles(updatedData);
	};

	const handleFileUpdate = (fileData) => {
		const {
			fileName,
			managerId,
			managerName,
			notes,
			priority,
			selectedAssignees,
			startDate,
			dueDate,
			status,
			_id,
		} = fileData;
		const updatedData = files?.map((file) =>
			file._id === _id
				? {
						...file,
						fileName,
						managerId,
						managerName,
						notes,
						priority,
						selectedAssignees,
						startDate,
						status,
						dueDate,
				  }
				: file,
		);
		setFiles(updatedData);
	};

	return isDataLoaded ? (
		<>
			<Flex mb={3} p={0}>
				<TextTitle title={"Files"} />
				<Spacer />
				<Button
					onClick={onOpen}
					color={"var(--main_color)"}
					bg={"var(--banner_bg)"}
					borderRadius={"8px"}
					size={"sm"}
					px={"2em"}
				>
					Add File
				</Button>
			</Flex>
			{isOpen && (
				<AddFile managers={managers} isOpen={isOpen} onClose={onClose} company={company} />
			)}
			<FilesOverView
				isDashboard={isDashboard}
				files={files}
				managers={managers}
				company={company}
				handleFileUpdate={handleFileUpdate}
				handleProjectUpdate={handleProjectUpdate}
				handleSubTaskUpdate={handleSubTaskUpdate}
				handleTaskUpdate={handleTaskUpdate}
				handleInnerSubTaskUpdate={handleInnerSubTaskUpdate}
			/>
		</>
	) : (
		<SkeletonLoader />
	);
};

export default FilesList;
