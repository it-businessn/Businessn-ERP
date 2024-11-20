import { SimpleGrid } from "@chakra-ui/react";

import useCompany from "hooks/useCompany";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import { isManager } from "utils";
import EmployeeViewCard from "./EmployeeViewCard";
import ManagerViewCard from "./ManagerViewCard";
import ResourceFile from "./ResourceFile";

const Resources = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const loggedInUser = LocalStorageService.getItem("user");
	const { fullName, role } = loggedInUser;
	const isUserManager = isManager(role);

	const FILE_TYPES = [
		{ type: "Training" },
		{ type: "Scripts" },
		{ type: "Product Knowledge" },
		{ type: "Employee Handbook" },
		{ type: "Associates" },
		{ type: "Training resources" },
	];
	const [selectedFilter, setSelectedFilter] = useState(FILE_TYPES[0].type);

	return (
		<PageLayout title={"Resources"}>
			<ResourceFile
				fileTypes={FILE_TYPES}
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
