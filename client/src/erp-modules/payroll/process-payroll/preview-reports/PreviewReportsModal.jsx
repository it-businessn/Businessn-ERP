import { HStack } from "@chakra-ui/react";
import Loader from "components/Loader";
import ModalLayout from "components/ui/modal/ModalLayout";
import NormalTextTitle from "components/ui/NormalTextTitle";
import EmployeeInfo from "./EmployeeInfo";
import EmployeePayDetails from "./EmployeePayDetails";

const PreviewReportsModal = ({
	isOpen,
	onClose,
	reportData,
	payPeriodNum,
	isReport,
}) => {
	return (
		<ModalLayout
			title={`Payroll Register`}
			size="7xl"
			isOpen={isOpen}
			onClose={onClose}
			textAlign={"center"}
			fontSize="3xl"
		>
			{!reportData && isReport ? (
				<Loader />
			) : (
				<NormalTextTitle
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
