import { HStack, SimpleGrid } from "@chakra-ui/react";
import RadioButtonGroup from "components/ui/tab/RadioButtonGroup";
import { ROLES } from "constant";
import useCompany from "hooks/useCompany";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import EarningsInfo from "./EarningsInfo";
import EmployeeInfo from "./EmployeeInfo";
import EmployerInfo from "./EmployerInfo";
import EmploymentInfo from "./EmploymentInfo";
import ReviewInfo from "./ReviewInfo";

const ROE = () => {
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const loggedInUser = LocalStorageService.getItem("user");
	const deptName = loggedInUser?.role === ROLES.MANAGER ? loggedInUser?.department : null;

	const handleNext = (id) => setViewMode(ROE_TABS[id]?.type);
	const ROE_TABS = [
		{
			id: 0,
			type: "Employee Info",
			name: (
				<EmployeeInfo tabId={1} company={company} handleNext={handleNext} deptName={deptName} />
			),
		},
		{
			id: 1,
			type: "Employment Info",
			name: <EmploymentInfo tabId={2} company={company} handleNext={handleNext} />,
		},
		{
			id: 2,
			type: "Employer Info",
			name: <EmployerInfo tabId={3} company={company} handleNext={handleNext} />,
		},
		{
			id: 3,
			type: "Earnings Info",
			name: <EarningsInfo tabId={4} company={company} handleNext={handleNext} />,
		},
		{
			id: 4,
			type: "Review",
			name: <ReviewInfo tabId={5} company={company} handleNext={handleNext} />,
		},
	];
	const [tabs, setTabs] = useState(ROE_TABS);
	const tabContent = ROE_TABS[0]?.type;
	const [viewMode, setViewMode] = useState(tabContent);

	const showComponent = (viewMode) => tabs.find(({ type }) => type === viewMode)?.name;

	return (
		<PageLayout title="Issue ROE">
			<HStack spacing="1em" mt={"1em"} justifyContent={"space-between"} w={"100%"}>
				<SimpleGrid
					columns={5}
					spacing="1em"
					my="5"
					bg={"var(--primary_bg)"}
					borderRadius={"20px"}
					p={"8px"}
					w={"100%"}
				>
					{tabs?.map((_) => (
						<RadioButtonGroup
							key={_?.id}
							name={_?.type}
							selectedFilter={viewMode}
							handleFilterClick={(name) => setViewMode(name)}
							fontSize={"1em"}
						/>
					))}
				</SimpleGrid>
			</HStack>
			{showComponent(viewMode)}
		</PageLayout>
	);
};

export default ROE;
