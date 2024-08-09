import { HStack } from "@chakra-ui/react";
import ModalLayout from "components/ui/modal/ModalLayout";
import TextTitle from "components/ui/text/TextTitle";
import useEmployeePayReport from "hooks/useEmployeePayReport";
import usePaygroup from "hooks/usePaygroup";
import { useParams } from "react-router-dom";
import LocalStorageService from "services/LocalStorageService";
import EmployeeInfo from "./EmployeeInfo";
import EmployeePayDetails from "./EmployeePayDetails";

const PreviewReportsModal = ({ isOpen, onClose }) => {
	const { payNo } = useParams();

	const company = LocalStorageService.getItem("selectedCompany");

	const { payGroupSchedule, closestRecord } = usePaygroup(company);
	const selectedPayPeriod = payNo
		? payGroupSchedule?.find(({ payPeriod }) => payPeriod.toString() === payNo)
		: closestRecord;
	const reportData = useEmployeePayReport(company, selectedPayPeriod);

	return (
		<ModalLayout
			title={`Preview Report`}
			size="7xl"
			isOpen={isOpen}
			onClose={onClose}
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
