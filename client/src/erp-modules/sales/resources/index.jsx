import { Box, SimpleGrid } from "@chakra-ui/react";
import Loader from "components/Loader";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import ResourceService from "services/ResourceService";
import { isManager } from "utils";
import AssociateViewCard from "./AssociateViewCard";
import FileUploader from "./FileUploader";
import ManagerViewCard from "./ManagerViewCard";
import ResourceFile from "./ResourceFile";

const Resources = () => {
	const { fullName, role } = LocalStorageService.getItem("user");
	const isUserManager = isManager(role);

	const [resources, setResources] = useState(null);
	const [newUpload, setNewUpload] = useState(null);
	const [selectedFilter, setSelectedFilter] = useState(null);

	useEffect(() => {
		const fetchAllResources = async () => {
			try {
				const response = await ResourceService.getResources();
				setResources(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllResources();
	}, [newUpload]);

	useEffect(() => {
		const fetchResourceByType = async () => {
			try {
				const response = await ResourceService.getResourcesByType(
					selectedFilter,
				);

				setResources(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		if (selectedFilter) {
			fetchResourceByType();
		}
	}, [selectedFilter]);

	const FILE_TYPES = [
		{ type: "Scripts" },
		{ type: "Product Knowledge" },
		{ type: "Employee Handbook" },
		{ type: "Associated" },
		{ type: "Training resources" },
	];
	return (
		<Box p={{ base: "1em", md: "2em" }} overflow={"auto"}>
			<TextTitle title="Resources" mb={"1em"} />
			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="1em"
				mt={"0.5em"}
			>
				{isUserManager ? <ManagerViewCard /> : <AssociateViewCard />}
			</SimpleGrid>
			{!resources && <Loader autoHeight />}
			{resources && isUserManager ? (
				<SimpleGrid columns={{ base: 1, md: 1, lg: 1 }}>
					<FileUploader
						setNewUpload={setNewUpload}
						fileTypes={FILE_TYPES}
						userName={fullName}
					/>
					<ResourceFile
						fileTypes={FILE_TYPES}
						selectedFilter={selectedFilter}
						setSelectedFilter={setSelectedFilter}
						resources={resources}
						setNewUpload={setNewUpload}
					/>
				</SimpleGrid>
			) : (
				<ResourceFile
					fileTypes={FILE_TYPES}
					selectedFilter={selectedFilter}
					setSelectedFilter={setSelectedFilter}
					resources={resources}
					setNewUpload={setNewUpload}
				/>
			)}
		</Box>
	);
};

export default Resources;
