import { Box } from "@chakra-ui/react";

import SkeletonLoader from "components/SkeletonLoader";
import useManager from "hooks/useManager";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import ProjectService from "services/ProjectService";
import { isManager } from "utils";
import FilesList from "./project";

const WorkView = () => {
	const company = LocalStorageService.getItem("selectedCompany");
	const loggedInUser = LocalStorageService.getItem("user");
	const [files, setFiles] = useState(null);
	const [isDataLoaded, setIsDataLoaded] = useState(false);

	const managers = useManager(company);
	const isManagerView = isManager(loggedInUser?.role);

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

	return (
		<PageLayout title={"File Overview"} showBgLayer>
			<Box
				p="1em"
				bg={"var(--primary_bg)"}
				border="2px solid var(--main_color)"
				borderRadius="10px"
				color={"var(--nav_color)"}
			>
				{isDataLoaded ? (
					<FilesList files={files} setFiles={setFiles} managers={managers} company={company} />
				) : (
					<SkeletonLoader />
				)}
			</Box>
		</PageLayout>
	);
};

export default WorkView;
