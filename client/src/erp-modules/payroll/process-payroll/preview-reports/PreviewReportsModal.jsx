import { Box } from "@chakra-ui/react";
import Loader from "components/Loader";
import ModalLayout from "components/ui/modal/ModalLayout";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import PayStubStatement from "../statement/PayStubStatement";

const PreviewReportsModal = ({
	isOpen,
	onClose,
	reportData,
	isReport,
	isEarningTable,
	size = "7xl",
	title = "Payroll Register",
	isIndividual,
}) => {
	const Statement = ({ data }) => (
		<Box
			borderBottom={"1px solid var(--calendar_border)"}
			mx={"auto"}
			height={isIndividual && "calc(100vh - 95px)"}
			overflow={isIndividual && "auto"}
		>
			<PayStubStatement data={data} />
		</Box>
	);

	return (
		<ModalLayout
			title={<TextTitle title={title} />}
			size={size}
			isOpen={isOpen}
			onClose={onClose}
			textAlign={"center"}
			fontSize="2xl"
			overflow={"hidden"}
			isReport={isReport}
			ml="-36px"
			reportData={
				isEarningTable
					? reportData?.payPeriodProcessingDate
					: reportData?.[0]?.payPeriodProcessingDate
			}
		>
			{isReport && !reportData && <Loader />}
			{!isEarningTable && !reportData?.length && (
				<NormalTextTitle align={"center"} size={"lg"} title={"No records found"} />
			)}
			{isEarningTable ? (
				<Statement data={reportData} />
			) : (
				reportData?.map((data) => <Statement data={data} key={data._id} />)
			)}
		</ModalLayout>
	);
};

export default PreviewReportsModal;
