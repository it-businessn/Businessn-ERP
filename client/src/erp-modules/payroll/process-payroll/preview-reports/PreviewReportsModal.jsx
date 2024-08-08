import { HStack } from "@chakra-ui/react";
import ModalLayout from "components/ui/modal/ModalLayout";
import useEmployeePayReport from "hooks/useEmployeePayReport";
import usePaygroup from "hooks/usePaygroup";
import LocalStorageService from "services/LocalStorageService";
import EmployeeInfo from "./EmployeeInfo";
import EmployeePayDetails from "./EmployeePayDetails";

const PreviewReportsModal = ({ isOpen, onClose }) => {
	const company = LocalStorageService.getItem("selectedCompany");
	const { closestRecord } = usePaygroup(company);
	const reportData = useEmployeePayReport(company, closestRecord);

	return (
		<ModalLayout
			title={`Preview Report`}
			size="7xl"
			isOpen={isOpen}
			onClose={onClose}
		>
			{reportData?.map((data) => {
				const regRate = data.currentPayDetails.regPay;
				const regHours = (data.totalRegHoursWorked / 60).toFixed(2);
				const currentTotal = regHours * regRate;

				return (
					<HStack
						border={"1px solid #eee"}
						alignItems={"start"}
						spacing={3}
						mx={"12em"}
						py={5}
						key={data._id}
						justifyContent={"space-around"}
					>
						<EmployeeInfo employee={data} closestRecord={closestRecord} />
						<EmployeePayDetails
							employee={data}
							currentTotal={currentTotal}
							regHours={regHours}
						/>
					</HStack>
				);
			})}
		</ModalLayout>
	);
};

export default PreviewReportsModal;
