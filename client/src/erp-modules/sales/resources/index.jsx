import { SimpleGrid } from "@chakra-ui/react";

import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import AssessmentService from "services/AssessmentService";
import LocalStorageService from "services/LocalStorageService";
import { isNotEnrollerOrEmployee } from "utils";
import EmployeeViewCard from "./EmployeeViewCard";
import ManagerViewCard from "./ManagerViewCard";
import ResourceFile from "./ResourceFile";

const Resources = ({ isHRType = false }) => {
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

	const company = LocalStorageService.getItem("selectedCompany");
	const loggedInUser = LocalStorageService.getItem("user");
	const isManagerRole = isNotEnrollerOrEmployee(loggedInUser.role);

	const [isDeleted, setIsDeleted] = useState(false);
	const [assessments, setAssessments] = useState(null);
	const [selectedFilter, setSelectedFilter] = useState(
		FILE_TYPES?.find(({ show }) => show === true)?.type,
	);

	useEffect(() => {
		const fetchAllAssessmentTypes = async () => {
			try {
				const { data } = await AssessmentService.getAssessmentTypes(company);
				setAssessments(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (selectedFilter === "Training") fetchAllAssessmentTypes();
	}, [selectedFilter, isDeleted]);

	return (
		<PageLayout title="Resources">
			<ResourceFile
				fileTypes={FILE_TYPES?.filter(({ show }) => show)}
				isUserManager={isManagerRole}
				fullName={loggedInUser.fullName}
				company={company}
				selectedFilter={selectedFilter}
				setSelectedFilter={setSelectedFilter}
			/>

			{selectedFilter === "Training" && (
				<SimpleGrid spacing="1em" mt={"0.5em"}>
					{isManagerRole ? (
						<ManagerViewCard assessments={assessments} setIsDeleted={setIsDeleted} />
					) : (
						<EmployeeViewCard assessments={assessments} loggedInUser={loggedInUser} />
					)}
				</SimpleGrid>
			)}
		</PageLayout>
	);
};

export default Resources;
