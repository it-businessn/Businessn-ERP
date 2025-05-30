import { HStack, SimpleGrid } from "@chakra-ui/react";
import RadioButtonGroup from "components/ui/tab/RadioButtonGroup";
import useCompany from "hooks/useCompany";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import AddBankingInfo from "./employee-tabs/bank-info/AddBankingInfo";
import AddBenefitsInfo from "./employee-tabs/benefit-info/AddBenefitsInfo";
import AddCorporateInfo from "./employee-tabs/employment-info/AddCorporateInfo";
import AddGovernmentContribution from "./employee-tabs/govt-info/AddGovernmentContribution";
import AddPayInfo from "./employee-tabs/pay-info/AddPayInfo";
import AddPersonalInfo from "./employee-tabs/personal-info/AddPersonalInfo";

const OnboardEmployee = ({ handleClose }) => {
	const { id, stepNo } = useParams();
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));

	const handleNext = (id) => setViewMode(SETUP_LIST[id]?.type);
	const handlePrev = (id) => setViewMode(SETUP_LIST[id - 2]?.type);

	const SETUP_LIST = [
		{
			id: 0,
			type: "Personal Info",
			name: <AddPersonalInfo id={1} company={company} handleNext={handleNext} />,
		},
		{
			id: 1,
			type: "Employment",
			name: (
				<AddCorporateInfo
					id={2}
					company={company}
					handleNext={handleNext}
					handlePrev={handlePrev}
				/>
			),
		},
		{
			id: 2,
			type: "Pay",
			name: <AddPayInfo id={3} company={company} handleNext={handleNext} handlePrev={handlePrev} />,
		},
		{
			id: 3,
			type: "Benefits",
			name: (
				<AddBenefitsInfo id={4} company={company} handleNext={handleNext} handlePrev={handlePrev} />
			),
		},
		{
			id: 4,
			type: "Government",
			name: (
				<AddGovernmentContribution
					id={5}
					company={company}
					handleNext={handleNext}
					handleClose={handleClose}
					handlePrev={handlePrev}
				/>
			),
		},
		{
			id: 5,
			type: "Banking",
			name: (
				<AddBankingInfo
					id={6}
					company={company}
					handlePrev={handlePrev}
					handleClose={handleClose}
				/>
			),
		},
	];

	const tabContent = id ? SETUP_LIST[stepNo]?.type : SETUP_LIST[0]?.type;
	const [viewMode, setViewMode] = useState(tabContent);
	const currentTab = SETUP_LIST.find(({ type }) => type === viewMode)?.id;
	const showComponent = (viewMode) => SETUP_LIST.find(({ type }) => type === viewMode)?.name;

	return (
		<PageLayout title={""}>
			<HStack spacing="1em" mt={0} justifyContent={"space-between"} w={"100%"}>
				<SimpleGrid
					columns={{ base: 4, lg: 6 }}
					spacing="1em"
					my="5"
					bg={"var(--primary_bg)"}
					borderRadius={"20px"}
					p={"8px"}
					w={"100%"}
				>
					{SETUP_LIST?.map((_) => (
						<RadioButtonGroup
							key={_?.id}
							name={_?.type}
							selectedFilter={viewMode}
							handleFilterClick={(name) => setViewMode(name)}
							fontSize={"1em"}
							rightIcon={<FaCheckCircle color={_?.id <= currentTab ? "green" : "grey"} />}
						/>
					))}
				</SimpleGrid>
			</HStack>
			{showComponent(viewMode)}
		</PageLayout>
	);
};

export default OnboardEmployee;
