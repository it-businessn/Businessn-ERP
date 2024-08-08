import { HStack } from "@chakra-ui/react";
import ModalLayout from "components/ui/modal/ModalLayout";
import useEmployeeHoursWorked from "hooks/useEmployeeHoursWorked";
import usePaygroup from "hooks/usePaygroup";
import LocalStorageService from "services/LocalStorageService";
import EmployeeInfo from "./EmployeeInfo";
import EmployeePayDetails from "./EmployeePayDetails";

const PreviewReportsModal = ({ isOpen, onClose }) => {
	const company = LocalStorageService.getItem("selectedCompany");
	const { closestRecord } = usePaygroup(company);
	const reportData = useEmployeeHoursWorked(company, closestRecord);

	console.log("reportData=", reportData);

	return (
		<ModalLayout
			title={`Preview Report`}
			size="7xl"
			isOpen={isOpen}
			onClose={onClose}
		>
			{reportData?.map((data) => (
				<HStack
					border={"1px solid #eee"}
					alignItems={"start"}
					spacing={3}
					mx={"12em"}
					py={5}
					key={data._id}
					justifyContent={"space-around"}
				>
					<EmployeeInfo employee={data} />
					<EmployeePayDetails employee={data} />
				</HStack>
			))}
		</ModalLayout>
	);
};

export default PreviewReportsModal;
