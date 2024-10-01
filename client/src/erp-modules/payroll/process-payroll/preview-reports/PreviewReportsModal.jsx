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
	payPeriodNum,
	isReport,
	isEarningTable,
	size = "7xl",
	title = "Payroll Register",
}) => {
	return (
		<ModalLayout
			title={<TextTitle title={title} />}
			size={size}
			isOpen={isOpen}
			onClose={onClose}
			textAlign={"center"}
			fontSize="2xl"
			overflow={"hidden"}
		>
			{isReport && !reportData && <Loader />}
			{!isEarningTable && !reportData?.length && (
				<NormalTextTitle
					align={"center"}
					size={"lg"}
					title={"No records found"}
				/>
			)}
			{isEarningTable ? (
				<Box
					borderBottom={"1px solid var(--calendar_border)"}
					mx={"auto"}
					pb={5}
				>
					<PayStubStatement data={reportData} isEarningTable={isEarningTable} />
				</Box>
			) : (
				reportData?.map((data) => (
					<Box
						key={data._id}
						borderBottom={"1px solid var(--calendar_border)"}
						mx={"auto"}
						pb={5}
					>
						<PayStubStatement data={data} />
					</Box>
				))
			)}
		</ModalLayout>
	);
};

export default PreviewReportsModal;
