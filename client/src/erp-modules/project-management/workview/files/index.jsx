import { Button, Flex, Spacer, useDisclosure } from "@chakra-ui/react";
import SkeletonLoader from "components/SkeletonLoader";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import ProjectService from "services/ProjectService";
import { isManager } from "utils";
import AddFile from "./AddFile";
import FilesOverView from "./FilesOverView";

const FilesList = ({ managers, company }) => {
	const loggedInUser = LocalStorageService.getItem("user");
	const isManagerView = isManager(loggedInUser?.role);

	const { isOpen, onOpen, onClose } = useDisclosure();

	const [files, setFiles] = useState(null);
	const [isDataLoaded, setIsDataLoaded] = useState(false);

	useEffect(() => {
		setIsDataLoaded(false);
		const fetchAllFiles = async () => {
			try {
				const { data } = isManagerView
					? await ProjectService.getAllCompanyFiles(company)
					: await ProjectService.getAllCompanyFilesByAssignee(loggedInUser?.fullName, company);
				setFiles(data);
			} catch (error) {
				console.error(error);
			}
			setIsDataLoaded(true);
		};
		fetchAllFiles();
	}, [company]);

	const handleSubTaskUpdate = (projectData) => {
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
						projects: file.projects?.map((project) => {
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

	const handleTaskUpdate = (projectData) => {
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
						projects: file.projects?.map((project) => {
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

	const handleProjectUpdate = (projectData, isEdit = true) => {
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
						projects: isEdit
							? file.projects?.map((project) => {
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
							  })
							: [...(file.projects || []), projectData],
				  }
				: file,
		);
		setFiles(updatedData);
	};

	const handleFileUpdate = (fileData, isEdit = true) => {
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
			<Flex>
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
				files={files}
				managers={managers}
				company={company}
				handleFileUpdate={handleFileUpdate}
				handleProjectUpdate={handleProjectUpdate}
				handleSubTaskUpdate={handleSubTaskUpdate}
				handleTaskUpdate={handleTaskUpdate}
			/>
		</>
	) : (
		<SkeletonLoader />
	);
};

export default FilesList;
