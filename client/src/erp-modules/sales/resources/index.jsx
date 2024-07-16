import { SimpleGrid } from "@chakra-ui/react";

import useCompany from "hooks/useCompany";
import PageLayout from "layouts/PageLayout";
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
	const loggedInUser = LocalStorageService.getItem("user");
	const { fullName, role } = loggedInUser;
	const isUserManager = isManager(role);

	const [resources, setResources] = useState(null);
	const [newUpload, setNewUpload] = useState(null);
	// const [editResource, setEditResource] = useState(false);
	const [selectedFilter, setSelectedFilter] = useState(FILE_TYPES[0].type);

	const { company } = useCompany();
	useEffect(() => {
		const fetchAllResources = async () => {
			try {
				const response = await ResourceService.getResourcesByCompany(company);
				setResources(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllResources();
	}, [newUpload, company]);

	useEffect(() => {
		const fetchResourceByType = async () => {
			try {
				const response = await ResourceService.getResourcesByType({
					type: selectedFilter,
					company,
				});

				setResources(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		if (selectedFilter) {
			fetchResourceByType();
		}
	}, [selectedFilter, company]);

	return (
		<PageLayout title={"Resources"}>
			<ResourceFile
				isUserManager={isUserManager}
				fullName={fullName}
				fileTypes={FILE_TYPES}
				selectedFilter={selectedFilter}
				setSelectedFilter={setSelectedFilter}
				resources={resources}
				setNewUpload={setNewUpload}
				company={company}
			/>
			{selectedFilter === "Training" && (
				<SimpleGrid spacing="1em" mt={"0.5em"}>
					{isUserManager ? (
						<ManagerViewCard company={company} />
					) : (
						<AssociateViewCard company={company} />
					)}
				</SimpleGrid>
			)}
		</PageLayout>
	);
};

export default Resources;
