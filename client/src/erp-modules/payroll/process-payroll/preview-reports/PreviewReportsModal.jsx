import { Box } from "@chakra-ui/react";
import Loader from "components/Loader";
import ModalLayout from "components/ui/modal/ModalLayout";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import PayStubStatement from "./PayStubStatement";

const PreviewReportsModal = ({
	isOpen,
	onClose,
	reportData,
	payPeriodNum,
	isReport,
}) => {
	return (
		<ModalLayout
			title={<TextTitle title={"Payroll Register"} />}
			size="3xl"
			isOpen={isOpen}
			onClose={onClose}
			textAlign={"center"}
			fontSize="2xl"
			overflow={"hidden"}
		>
			{isReport && !reportData && <Loader />}
			{!reportData?.length && (
				<NormalTextTitle
					align={"center"}
					size={"lg"}
					title={"No records found"}
				/>
			)}
			{reportData?.map((data) => (
				<Box key={data._id}>
					<PayStubStatement data={data} />
				</Box>
			))}
		</ModalLayout>
	);
};

export default PreviewReportsModal;
