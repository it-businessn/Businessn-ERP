import { Box, HStack, Stack, VStack } from "@chakra-ui/react";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
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
	<HStack w={"100%"}>
		<NormalTextTitle width={"180px"} title={title1} size={"xs"} />
		<TextTitle
			width={"100%"}
			bg={hasBg && "var(--calendar_border)"}
			p={hasBg && 1}
			border={hasBg && "1px solid var(--main_color_black)"}
			whiteSpace="wrap"
			title={title2}
			size={"xs"}
			align={"left"}
		/>
		<TextTitle width={"200px"} align={"left"} title={title3} size={"xs"} />
	</HStack>
);

const ChequeDetails = ({ data, companyInfo, flex, isMobile }) => {
	const name = data?.empId?.fullName;
	const payDate = data.payPeriodPayDate;

	const isSuperficialType = data?.reportType === "4";
	const isManualType = data?.reportType === "3";

	data.currentNetPay = isSuperficialType ? 0 : data.currentNetPay;
	const paymentType = isManualType ? "Manual" : "DIRECT DEPOSIT";

	const netPay = getAmount(data?.currentNetPay);
	const amountInWords = toWords.convert(data?.currentNetPay);

	return isMobile ? (
		<Box
			w="full"
			mt={6}
			p={4}
			border="2px dashed red"
			borderRadius="md"
			bg="gray.50"
			textAlign="center"
		>
			<PayStubHeader isMobile companyInfo={companyInfo} />
			<TextTitle title={`Payable by Cheque to:`} />
			<TextTitle size="md" title={`${name}`} />
			<TextTitle size="md" title={`${netPay}`} />
			{/* <TextTitle title={`${paymentType}`} /> */}
			<TextTitle
				mt={"2em"}
				color={"var(--filter_border_color)"}
				whiteSpace="wrap"
				title={"***THIS IS NOT A CHEQUE. DO NOT DEPOSIT.***"}
			/>
		</Box>
	) : (
		<Stack w={"100%"} justifyContent={"center"} flex={flex} minH="15em" mt={"0.5em"}>
			<PayStubHeader companyInfo={companyInfo} />
			<VStack w="100%" mx="auto" spacing={"2em"}>
				<Box>
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
