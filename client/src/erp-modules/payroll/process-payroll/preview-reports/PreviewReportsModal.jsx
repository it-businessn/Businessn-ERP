import { HStack } from "@chakra-ui/react";
import ModalLayout from "components/ui/modal/ModalLayout";
import TextTitle from "components/ui/text/TextTitle";
import EmployeeInfo from "./EmployeeInfo";
import EmployeePayDetails from "./EmployeePayDetails";

const PreviewReportsModal = ({ isOpen, onClose, reportData }) => {
	return (
		<ModalLayout
			title={`Current Payperiod#${
				reportData ? reportData?.[0]?.payPeriodNum : ""
			} `}
			size="7xl"
			isOpen={isOpen}
			onClose={onClose}
			textAlign={"center"}
			fontSize="3xl"
		>
			{!reportData?.length && (
				<TextTitle weight="normal" title={"No records found"} />
			)}
			{reportData?.map((data) => {
				return (
					<HStack
						border={"1px solid var(--lead_cards_border)"}
						alignItems={"start"}
						spacing={3}
						py={5}
						key={data._id}
						justifyContent={"space-around"}
						w={"60%"}
					>
						<EmployeeInfo data={data} />
						<EmployeePayDetails data={data} />
					</HStack>
				);
			})}
		</ModalLayout>
	);
};

export default PreviewReportsModal;
