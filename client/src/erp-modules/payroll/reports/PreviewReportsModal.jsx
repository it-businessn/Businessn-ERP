import { Box } from "@chakra-ui/react";
import Loader from "components/Loader";
import ModalLayout from "components/ui/modal/ModalLayout";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import MobilePayStub from "../process-payroll/statement/MobilePayStub";
import PayStubStatement from "../process-payroll/statement/PayStubStatement";

const PreviewReportsModal = ({
	isOpen,
	onClose,
	reportData,
	isReport,
	isEarningTable,
	size = "7xl",
	title = "Payroll Register",
	isMobile,
}) => {
	const Statement = ({ data }) => (
		<Box borderBottom="1px solid var(--calendar_border)" mx="auto">
			<PayStubStatement data={data} height="98vh" />
		</Box>
	);

	return isMobile ? (
		<MobilePayStub
			onClose={onClose}
			isOpen={isOpen}
			reportData={reportData}
			title={<TextTitle title={title} />}
		/>
	) : (
		<ModalLayout
			title={<TextTitle title={title} />}
			size={size}
			isOpen={isOpen}
			onClose={onClose}
			textAlign={"center"}
			fontSize="2xl"
			overflow={"hidden"}
			isReport={isReport}
			p="1em"
			px={0}
			empName={isEarningTable ? reportData?.empId?.fullName : null}
			reportData={isEarningTable ? reportData : reportData?.[0]}
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
