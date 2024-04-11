import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import { doughnutOptions, trainingChartData } from "constant";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import LocalStorageService from "services/LocalStorageService";
import ResourceService from "services/ResourceService";
import AssociateViewCard from "./AssociateViewCard";
import FileUploader from "./FileUploader";
import ManagerViewCard from "./ManagerViewCard";
import ResourceFile from "./ResourceFile";

const Resources = () => {
	const user = LocalStorageService.getItem("user");
	const isManager = user.role === "Administrators";

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
			<Text fontWeight="bold" mb={"1em"}>
				Resources
			</Text>
			<SimpleGrid
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="1em"
				mt={"0.5em"}
			>
				<Box
					px="1em"
					py="0.5em"
					bg={"brand.primary_bg"}
					border="3px solid var(--main_color)"
					borderRadius="10px"
					fontWeight="bold"
					color={"brand.nav_color"}
				>
					<Text fontWeight="bold">Training</Text>
					<Box w={{ base: "60%", md: "40%", lg: "60%", xl: "40%" }} mx={"auto"}>
						<Doughnut
							data={trainingChartData}
							options={doughnutOptions("40%")}
						/>
					</Box>
				</Box>
				{isManager ? <ManagerViewCard /> : <AssociateViewCard />}
			</SimpleGrid>
			{isManager ? (
				<SimpleGrid columns={{ base: 1, md: 1, lg: 1 }}>
					<FileUploader
						setNewUpload={setNewUpload}
						fileTypes={FILE_TYPES}
						userName={user.fullName}
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
