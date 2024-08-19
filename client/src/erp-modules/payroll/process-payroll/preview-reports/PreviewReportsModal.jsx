import { HStack } from "@chakra-ui/react";
import ModalLayout from "components/ui/modal/ModalLayout";
import TextTitle from "components/ui/text/TextTitle";
import EmployeeInfo from "./EmployeeInfo";
import EmployeePayDetails from "./EmployeePayDetails";

const PreviewReportsModal = ({ isOpen, onClose, reportData, payPeriodNum }) => {
	return (
		<ModalLayout
			title={`Payroll register`}
			size="7xl"
			isOpen={isOpen}
			onClose={onClose}
			textAlign={"center"}
			fontSize="3xl"
		>
			{!reportData?.length && (
				<TextTitle
					weight="normal"
					align={"center"}
					size={"lg"}
					title={"No records found"}
				/>
			)}
			{reportData?.map((data) => (
				<HStack
					border={"1px solid var(--lead_cards_border)"}
					alignItems={"start"}
					spacing={3}
					py={5}
					key={data._id}
					justifyContent={"center"}
					w={"100%"}
					mx={"auto"}
				>
					<EmployeeInfo data={data} />
					<EmployeePayDetails data={data} />
				</HStack>
			))}
		</ModalLayout>
	);
};

export default PreviewReportsModal;
