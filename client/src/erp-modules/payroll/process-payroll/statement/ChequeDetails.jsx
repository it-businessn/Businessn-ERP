import { Box, HStack, Stack, VStack } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { PAYRUN_TYPE_CODE } from "constant";
import { toWords } from "utils";
import { getAmount } from "utils/convertAmt";
import { monthDayYearFormat } from "utils/convertDate";
import PayStubHeader from "./PayStubHeader";

const PaymentDateTitle = ({ payDate }) => (
	<TextTitle
		p="0 2em"
		align="right"
		title={`Payment Date: ${monthDayYearFormat(payDate)}`}
		size={"xs"}
	/>
);

const InfoText = ({ title1, title2, title3, hasBg }) => (
	<HStack w={"100%"} justifyContent="start">
		<NormalTextTitle title={title1} size={"xs"} flex={0.2} />
		<TextTitle
			bg={hasBg && "var(--calendar_border)"}
			p={hasBg && 1}
			border={hasBg && "1px solid var(--main_color_black)"}
			whiteSpace="wrap"
			title={title2}
			size={"xs"}
			align={"left"}
			flex={0.6}
		/>
		<TextTitle align={"left"} title={title3} size={"xs"} flex={0.2} />
	</HStack>
);

const ChequeDetails = ({ data, companyInfo, flex, isMobile }) => {
	const name = data?.empId?.fullName;
	const payDate = data.payPeriodPayDate;

	const isSuperficialType = data?.reportType === PAYRUN_TYPE_CODE.SUPERFICIAL;
	const isManualType = data?.reportType === PAYRUN_TYPE_CODE.MANUAL;

	data.currentNetPay = isSuperficialType ? 0 : data.currentNetPay;
	const paymentType = isManualType ? "Manual" : "DIRECT DEPOSIT";

	const netPay = getAmount(data?.currentNetPay);
	const amountInWords = toWords.convert(data?.currentNetPay);

	return isMobile ? (
		<Box w="full" p={4} border="2px dashed red" borderRadius="md" bg="gray.50" textAlign="center">
			<PayStubHeader isMobile companyInfo={companyInfo} />
			<VStack spacing={5} justifyContent={"space-between"}>
				<Box mt={3}>
					<TextTitle title={`Payable by Cheque to:`} />
					<TextTitle size="md" title={`${name}`} />
					<TextTitle size="md" title={`${netPay}`} />
					{/* <TextTitle title={`${paymentType}`} /> */}{" "}
				</Box>
				<TextTitle
					color={"var(--filter_border_color)"}
					whiteSpace="wrap"
					title={"***THIS IS NOT A CHEQUE. DO NOT DEPOSIT.***"}
				/>
			</VStack>
		</Box>
	) : (
		<Stack w={"100%"} justifyContent={"center"} flex={flex} minH="15em">
			<PayStubHeader companyInfo={companyInfo} />
			<VStack w="100%" mx="auto" spacing={"2em"}>
				<Box w="98%">
					<PaymentDateTitle payDate={payDate} />
					<InfoText title1="Account holder:" title2={name} />
					<InfoText title1="The amount:" title2={amountInWords} title3={netPay} hasBg />
					<InfoText title1="Payment method:" title2={paymentType} />
				</Box>
				<TextTitle
					align={"center"}
					color={"var(--filter_border_color)"}
					title={"THIS IS NOT A CHEQUE. DO NOT DEPOSIT."}
				/>
			</VStack>
		</Stack>
	);
};

export default ChequeDetails;
