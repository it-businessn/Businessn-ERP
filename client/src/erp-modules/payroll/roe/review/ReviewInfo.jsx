import {
	Alert,
	AlertIcon,
	Badge,
	Box,
	Button,
	Flex,
	HStack,
	Image,
	Spacer,
	Stack,
	Text,
	Textarea,
	VStack,
} from "@chakra-ui/react";
import { useRef } from "react";
import { FaPaperPlane, FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import flag from "../../../../assets/world.png";
import { COPY_NOTICE, formatPayDate } from "../roeUtils";
import {
	Block1,
	Block10,
	Block11,
	Block12,
	Block13,
	Block14,
	Block15a,
	Block15b,
	Block15c,
	Block16,
	Block17,
	Block18,
	Block19,
	Block2,
	Block20,
	Block21,
	Block22,
	Block3,
	Block4,
	Block5,
	Block6,
	Block7,
	Block8,
	Block9,
} from "./blocks";

/** The ROE laid out as the Service Canada form; DRAFT until submitted. */
export const ROEForm = ({ formData, employer, payPeriodType, isCopy }) => {
	const e = formData?.employmentInfo || {};
	const er = formData?.employerInfo || {};
	const employerBlock = { ...employer, name: employer?.name || er.name };
	return (
		<Box position="relative" bg="white" fontFamily="Arial, sans-serif" fontSize="10px" p={6}>
			{!isCopy && (
				<Text
					position="absolute"
					top="50%"
					left="50%"
					transform="translate(-50%, -50%) rotate(-45deg)"
					fontSize="9em"
					fontWeight="bold"
					color="gray.300"
					opacity={0.5}
					pointerEvents="none"
					zIndex={0}
					whiteSpace="nowrap"
				>
					DRAFT COPY
				</Text>
			)}
			<Box position="relative" zIndex={1}>
				{isCopy && (
					<Box border="1px solid" p={2} mb={2} textAlign="center" fontWeight="bold" fontSize="11px">
						{COPY_NOTICE}
					</Box>
				)}
				<Flex justify="space-between" align="center">
					<Flex align="center" gap={4}>
						<Image src={flag} alt="Canada" boxSize="10" />
						<Text fontWeight="bold" lineHeight={1} fontSize="12px" w="50px">
							Service Canada
						</Text>
					</Flex>
					<Text>Protected when completed - B</Text>
				</Flex>
				<Text fontWeight="bold" fontSize="13px" my={1}>
					RECORD OF EMPLOYMENT (ROE)
				</Text>
				<HStack w="100%" spacing={0} alignItems="self-start">
					<Block1 />
					<Block2 />
					<Block3 refNum={formData?.payrollReferenceNumber || e.employeeNo} />
				</HStack>
				<HStack spacing={0} alignItems="self-start" borderLeft="1px solid">
					<VStack flex={1} alignItems="start">
						<Block4 companyInfo={employerBlock} />
						<HStack w="100%">
							<Spacer />
							<Block7 companyInfo={employerBlock} />
						</HStack>
					</VStack>
					<VStack flex={0.6} spacing={0} alignItems="self-start" border="1px solid" borderBottom={0}>
						<Block5 accNum={employer?.cra_business_number || formData?.craBusinessNumber} />
						<Block6 payPeriod={payPeriodType} />
						<Block14 recallDate={e.recallDate} expectedRecallDate={e.expectedRecallDate} />
					</VStack>
					<VStack flex={0.8} spacing={0} borderRight="1px solid" alignItems="self-start">
						<Block8 sin={formData?.empInfo?.SIN} />
						<Block10 firstDayWorked={e.employmentStartDate} />
						<Block11 lastDayWorked={e.employmentLeaveDate} />
						<Block12 finalPayPeriodEndDate={e.finalPayPeriodEndDate} />
						<Block13 occupation={e.positions?.[0]?.title} />
					</VStack>
				</HStack>
				<HStack alignItems="self-start" spacing={0}>
					<VStack border="1px solid" flex={1} alignItems="self-start" spacing={0}>
						<Block9 empInfo={formData?.empInfo} />
						<Block16
							reasonCode={e.reasonCode}
							contactName={er.contactName}
							contactNumber={er.contactTelNumber}
							contactExt={er.contactExtNumber}
						/>
						<Block17
							vacationPayCode={e.vacationPayCode}
							vacationPayAmount={e.vacationPayAmount}
							vacationPayStartDate={e.vacationPayStartDate}
							vacationPayEndDate={e.vacationPayEndDate}
							statHolidays={e.statHolidays}
							otherMonies={e.otherMonies}
						/>
						<Block18 comments={formData?.comments?.message} />
						<Block19 specialPayments={e.specialPayments} />
						<HStack borderTop="1px solid" w="100%">
							<Block20 preferredCommunication={er.preferredCommunication} />
							<Block21 issuerTelNumber={er.issuerTelNumber} issuerExt={er.issuerExtNumber} />
						</HStack>
						<Block22 issuerName={er.issuerName} dateIssued={formData?.dateIssued || new Date()} />
					</VStack>
					<VStack flex={1} border="1px solid" borderLeft={0} alignItems="self-start" spacing={0}>
						<Block15a hours={formData?.earningsInfo?.totalInsurableHours} />
						<Block15b amt={formData?.earningsInfo?.totalInsurableEarnings} />
						<Block15c earningsData={formData?.earningsInfo?.earningsData} payPeriod={payPeriodType} />
					</VStack>
				</HStack>
			</Box>
		</Box>
	);
};

// ROE-01 tab 5: the whole ROE for a last check, comments (block 18), print,
// submit. A submitted ROE prints as a copy with the filed-copy notice.
const ReviewInfo = ({
	formData,
	employer,
	payPeriodType,
	handleFieldChange,
	isSubmitted,
	submittedOn,
	onSubmit,
	isSaving,
}) => {
	const componentRef = useRef();
	const name = [formData?.empInfo?.firstName, formData?.empInfo?.lastName].filter(Boolean).join(" ");
	const handlePrint = useReactToPrint({
		contentRef: componentRef,
		documentTitle: `ROE ${name}${isSubmitted ? " (copy)" : " (draft)"}`,
	});

	return (
		<Stack spacing={4} p={2}>
			<HStack justify="space-between" align="start">
				<HStack>
					<Badge colorScheme={isSubmitted ? "green" : "orange"} fontSize="sm">
						{isSubmitted ? "Submitted" : "Draft"}
					</Badge>
					{isSubmitted && submittedOn && <Text color="gray.600">on {formatPayDate(submittedOn)}</Text>}
				</HStack>
				<HStack>
					<Button leftIcon={<FaPrint />} variant="outline" onClick={() => handlePrint()}>
						{isSubmitted ? "Print copy" : "Print draft"}
					</Button>
					{!isSubmitted && (
						<Button
							leftIcon={<FaPaperPlane />}
							bg="var(--banner_bg)"
							color="white"
							_hover={{ bg: "#4a2b4a" }}
							isLoading={isSaving}
							onClick={onSubmit}
						>
							Submit
						</Button>
					)}
				</HStack>
			</HStack>
			{isSubmitted ? (
				<Alert status="success" borderRadius="md">
					<AlertIcon />
					{COPY_NOTICE}
				</Alert>
			) : (
				<Box>
					<Text fontWeight="semibold" mb={1}>
						Comments (block 18)
					</Text>
					<Textarea
						aria-label="Comments"
						maxLength={160}
						value={formData?.comments?.message || ""}
						onChange={(ev) => handleFieldChange("comments", "message", ev.target.value)}
						placeholder="Optional"
					/>
				</Box>
			)}
			<Box border="1px solid" borderColor="gray.200" overflowX="auto">
				<Box ref={componentRef}>
					<ROEForm
						formData={formData}
						employer={employer}
						payPeriodType={payPeriodType}
						isCopy={isSubmitted}
					/>
				</Box>
			</Box>
		</Stack>
	);
};

export default ReviewInfo;
