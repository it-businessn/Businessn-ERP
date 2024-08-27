import { Box, Center, HStack } from "@chakra-ui/react";
import Loader from "components/Loader";
import Logo from "components/logo";
import ModalLayout from "components/ui/modal/ModalLayout";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import payStubImg from "../../../../assets/coverImgPaystub.png";
import EmployeeInfo from "./EmployeeInfo";
import EmployeePayDetails from "./EmployeePayDetails";

const PreviewReportsModal = ({
	isOpen,
	onClose,
	reportData,
	payPeriodNum,
	isReport,
}) => {
	// `Payroll Register`
	const ModalHeaderContent = () => (
		<>
			<Logo isCover isForgotPassword />{" "}
			{/* <TextTitle
				align={"center"}
				title={"Earnings Statement"}
				position="relative"
			/> */}
		</>
	);
	return (
		<ModalLayout
			title={<ModalHeaderContent />}
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
					<Box key={data._id} position="relative" padding={0}>
						<Box
							w={"100%"}
							h={"100%"}
							top={0}
							left={0}
							position={"absolute"}
							backgroundImage={payStubImg}
							backgroundSize="contain"
							backgroundPosition="center"
							backgroundColor="var(--lead_cards_border)"
							backgroundBlendMode="overlay"
							filter={"opacity(0.2)"}
						/>
						<HStack
							alignItems={"start"}
							spacing={5}
							justifyContent={"center"}
							p={8}
						>
							<EmployeeInfo data={data} />
							<EmployeePayDetails data={data} />
						</HStack>
					</Box>
					<Box>
						<ModalHeaderContent />
						<TextTitle
							align={"end"}
							whiteSpace="wrap"
							title={"Payment Date:"}
							size={"xs"}
						/>
						<TextTitle whiteSpace="wrap" title={"Payment Date:"} size={"xs"} />
						<TextTitle whiteSpace="wrap" title={"Payment Date:"} size={"xs"} />
						<TextTitle whiteSpace="wrap" title={"Payment Date:"} size={"xs"} />
					</Box>
					<Center color={"var(--filter_border_color)"}>
						THIS IS NOT A CHEQUE. DO NOT DEPOSIT.
					</Center>
				</Box>
			))}
		</ModalLayout>
	);
};

export default PreviewReportsModal;
