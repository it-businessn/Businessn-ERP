import { Box, SimpleGrid } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";

import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import ResourceService from "services/ResourceService";
import { isManager } from "utils";
import { loggedInUser } from "utils/common";
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
	const { fullName, role } = loggedInUser;
	const isUserManager = isManager(role);

	const [resources, setResources] = useState(null);
	const [newUpload, setNewUpload] = useState(null);
	// const [editResource, setEditResource] = useState(false);
	const [selectedFilter, setSelectedFilter] = useState(FILE_TYPES[0].type);
	const [company, setCompany] = useState(
		LocalStorageService.getItem("selectedCompany"),
	);

	useEffect(() => {
		const handleSelectedCompanyChange = (event) => setCompany(event.detail);

		document.addEventListener(
			"selectedCompanyChanged",
			handleSelectedCompanyChange,
		);

		return () => {
			document.removeEventListener(
				"selectedCompanyChanged",
				handleSelectedCompanyChange,
			);
		};
	}, []);
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
		</Box>
	);
};

export default Resources;
