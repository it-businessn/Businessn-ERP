import { SimpleGrid, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExtraPayrunModal from "./ExtraPayrunModal";
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

	const navigate = useNavigate();

	const handleClick = (val) => {
		if (val === "extra") {
			setShowExtraPayrun(true);
		}
		if (val === "empUpdate") {
			navigate(empPath);
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
				<VStack w={"100%"} alignItems={"end"} spacing={0}>
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
