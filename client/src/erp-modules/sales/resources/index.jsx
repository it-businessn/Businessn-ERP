import { Box, SimpleGrid } from "@chakra-ui/react";
import Loader from "components/Loader";
import TextTitle from "components/ui/text/TextTitle";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import ResourceService from "services/ResourceService";
import { isManager } from "utils";
import AssociateViewCard from "./AssociateViewCard";
import ManagerViewCard from "./ManagerViewCard";
import ResourceFile from "./ResourceFile";

const FILE_TYPES = [
	{ type: "Training" },
	{ type: "Scripts" },
	{ type: "Product Knowledge" },
	{ type: "Employee Handbook" },
	{ type: "Associates" },
	{ type: "Training resources" },
];

const Resources = () => {
	const { fullName, role } = LocalStorageService.getItem("user");
	const isUserManager = isManager(role);

	const [resources, setResources] = useState(null);
	const [newUpload, setNewUpload] = useState(null);
	const [selectedFilter, setSelectedFilter] = useState(FILE_TYPES[0].type);

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
	return (
		<Box p={{ base: "1em", md: "2em" }} overflow={"auto"}>
			<TextTitle title="Resources" mb={"1em"} />
			<ResourceFile
				isUserManager={isUserManager}
				fullName={fullName}
				fileTypes={FILE_TYPES}
				selectedFilter={selectedFilter}
				setSelectedFilter={setSelectedFilter}
				resources={resources}
				setNewUpload={setNewUpload}
			/>
			{selectedFilter === "Training" && (
				<SimpleGrid spacing="1em" mt={"0.5em"}>
					{isUserManager ? <ManagerViewCard /> : <AssociateViewCard />}
				</SimpleGrid>
			)}
			{!resources && <Loader />}
		</Box>
	);
};

export default Resources;
