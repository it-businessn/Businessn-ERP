import { HStack, Select, SimpleGrid, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExtraPayrunModal from "./ExtraPayrunModal";
import OnboardEmpModal from "./OnboardEmpModal";
import PayrollActions from "./PayrollActions";
import WorkviewTable from "./WorkviewTable";

const PaygroupTable = ({
	selectedPayGroup,
	company,
	payGroupSchedule,
	setRefresh,
	closestRecord,
	closestRecordIndex,
	empPath,
	selectedYear,
	setSelectedYear,
	yearsList,
	loggedInUser,
}) => {
	const [showExtraPayrun, setShowExtraPayrun] = useState(false);
	const [showOnboard, setShowOnboard] = useState(false);
	const navigate = useNavigate();

	const handleClick = (val) => {
		if (val === "extra") {
			setShowExtraPayrun(true);
		}
		if (val === "empUpdate") {
			navigate(empPath);
		}
		if (val === "onboard") {
			setShowOnboard(true);
		}
		if (val === "terminate") {
			navigate(`${empPath}/${loggedInUser._id}/3`);
		}
	};

	return (
		<SimpleGrid
			columns={{ base: 1, md: 1, lg: 2 }}
			spacing="4"
			my="4"
			mr="4"
			templateColumns={{ lg: "70% 30%" }}
		>
			<BoxCard>
				<VStack w={"100%"} alignItems={"end"} spacing={2}>
					<HStack justifyContent="end" alignItems="center">
						<Select
							size={"sm"}
							border="1px solid var(--primary_button_bg)"
							borderRadius="10px"
							value={selectedYear}
							placeholder="Select Year"
							onChange={(e) => setSelectedYear(e.target.value)}
						>
							{yearsList?.map((year) => (
								<option value={year} key={year}>
									{year}
								</option>
							))}
						</Select>

						<PrimaryButton
							name={"Add extra payrun"}
							size="xs"
							px={"3em"}
							onOpen={() => setShowExtraPayrun(true)}
						/>
					</HStack>
					{showExtraPayrun && (
						<ExtraPayrunModal
							company={company}
							showExtraPayrun={showExtraPayrun}
							setRefresh={setRefresh}
							setShowExtraPayrun={setShowExtraPayrun}
							selectedPayGroup={selectedPayGroup}
							closestRecord={closestRecord}
						/>
					)}
					{showOnboard && (
						<OnboardEmpModal
							title={"Onboard employee"}
							showOnboard={showOnboard}
							setShowOnboard={setShowOnboard}
							selectedPayGroupName={selectedPayGroup?.name}
						/>
					)}
					<WorkviewTable
						payGroupSchedule={payGroupSchedule}
						closestRecordIndex={closestRecordIndex}
						autoScroll
						selectedYear={selectedYear}
					/>
				</VStack>
			</BoxCard>
			<PayrollActions handleClick={handleClick} />
		</SimpleGrid>
	);
};

export default PaygroupTable;
