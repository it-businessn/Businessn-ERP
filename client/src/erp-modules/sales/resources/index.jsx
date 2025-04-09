import { SimpleGrid } from "@chakra-ui/react";

import useCompany from "hooks/useCompany";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import { isManager } from "utils";
import EmployeeViewCard from "./EmployeeViewCard";
import ManagerViewCard from "./ManagerViewCard";
import ResourceFile from "./ResourceFile";

const Resources = ({ isHRType = false }) => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const loggedInUser = LocalStorageService.getItem("user");
	const { fullName, role } = loggedInUser;
	const isUserManager = isManager(role);

	const FILE_TYPES = [
		{ type: "Training", show: isHRType },
		{ type: "Sales Scripts", show: true },
		{ type: "On-boarding Scripts", show: true },
		{ type: "Marketing Scripts", show: true },
		{ type: "Product Knowledge", show: true },
		{ type: "Employee Handbook", show: true },
		{ type: "Associates", show: true },
		{ type: "Training resources", show: true },
	];
	const [selectedFilter, setSelectedFilter] = useState(
		FILE_TYPES?.find(({ show }) => show === true)?.type,
	);

	return (
		<PageLayout title="Resources">
			<ResourceFile
				fileTypes={FILE_TYPES?.filter(({ show }) => show)}
				isUserManager={isUserManager}
				fullName={fullName}
				company={company}
				selectedFilter={selectedFilter}
				setSelectedFilter={setSelectedFilter}
			/>

			{selectedFilter === "Training" && (
				<SimpleGrid spacing="1em" mt={"0.5em"}>
					{isUserManager ? (
						<ManagerViewCard company={company} />
					) : (
						<EmployeeViewCard company={company} />
					)}
				</SimpleGrid>
			)}
		</PageLayout>
	);
};

export default Resources;
