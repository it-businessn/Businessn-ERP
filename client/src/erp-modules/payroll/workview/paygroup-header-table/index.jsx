import { SimpleGrid, VStack } from "@chakra-ui/react";
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
}) => {
	const [showExtraPayrun, setShowExtraPayrun] = useState(false);
	const [showOnboard, setShowOnboard] = useState(false);
	const [showTerminate, setShowTerminate] = useState(false);

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
			setShowTerminate(true);
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
					<PrimaryButton
						name={"Add extra payrun"}
						size="xs"
						px={0}
						onOpen={() => setShowExtraPayrun(true)}
					/>
					{showExtraPayrun && (
						<ExtraPayrunModal
							selectedPayGroupId={selectedPayGroup._id}
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
					{/* {showTerminate && (
						<OnboardEmpModal
							title={"Terminate employee"}
							showOnboard={showTerminate}
							setShowOnboard={setShowTerminate}
							selectedPayGroupName={selectedPayGroup?.name}
						/>
					)} */}

					<WorkviewTable
						payGroupSchedule={payGroupSchedule}
						closestRecordIndex={closestRecordIndex}
						autoScroll
					/>
				</VStack>
			</BoxCard>
			<PayrollActions handleClick={handleClick} />
		</SimpleGrid>
	);
};

export default PaygroupTable;
