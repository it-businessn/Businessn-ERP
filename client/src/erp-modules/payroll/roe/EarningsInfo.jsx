import {
	Alert,
	AlertIcon,
	Box,
	Button,
	HStack,
	IconButton,
	Spinner,
	Stack,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tooltip,
	Tr,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiMerge } from "react-icons/bi";
import { MdCallSplit } from "react-icons/md";
import { convertDecimal, getAmount } from "utils/convertAmt";
import RoeSection from "./RoeSection";
import { formatPayDate, splitColumns } from "./roeUtils";

const COLS = ["ROE PP", "Payroll PP", "PP End Date", "Insurable Earnings", "Insurable Hours"];

const PeriodTable = ({ rows, label }) => (
	<Table size="sm" variant="simple" aria-label={label} bg="var(--lead_cards_bg)">
		<Thead position="sticky" top={0} zIndex={1} bg="gray.50">
			<Tr>
				{COLS.map((col) => (
					<Th key={col} textAlign="center" px={2}>
						{col}
					</Th>
				))}
			</Tr>
		</Thead>
		<Tbody>
			{rows.map(({ roePP, payPeriodNum, payPeriodEndDate, currentGrossPay, insurableHours }) => (
				<Tr key={`${roePP}_${payPeriodEndDate}`}>
					<Td textAlign="center" fontWeight="semibold">
						{roePP}
					</Td>
					<Td textAlign="center">{payPeriodNum ?? "-"}</Td>
					<Td textAlign="center">{formatPayDate(payPeriodEndDate)}</Td>
					<Td textAlign="right">{getAmount(currentGrossPay)}</Td>
					<Td textAlign="right">{convertDecimal(insurableHours)}</Td>
				</Tr>
			))}
		</Tbody>
	</Table>
);

/**
 * Block 15C as on the ROE: ROE PP 1, 3, 5... on the left and 2, 4, 6... on the
 * right; the button in between merges them into one list (and splits again).
 */
export const EarningsTable = ({ periods }) => {
	const [merged, setMerged] = useState(false);
	const { left, right } = splitColumns(periods);
	return (
		<HStack align="start" spacing={2} maxH="55vh" overflow="auto">
			{merged ? (
				<Box flex={1}>
					<PeriodTable rows={periods} label="Insurable earnings by pay period" />
				</Box>
			) : (
				<Box flex={1}>
					<PeriodTable rows={left} label="Insurable earnings, odd pay periods" />
				</Box>
			)}
			<Tooltip label={merged ? "Split into two columns" : "Merge into one list"}>
				<IconButton
					size="sm"
					mt={8}
					variant="outline"
					icon={merged ? <MdCallSplit /> : <BiMerge />}
					aria-label={merged ? "Split into two columns" : "Merge into one list"}
					onClick={() => setMerged(!merged)}
				/>
			</Tooltip>
			{!merged && (
				<Box flex={1}>
					<PeriodTable rows={right} label="Insurable earnings, even pay periods" />
				</Box>
			)}
		</HStack>
	);
};

export const EarningsTotals = ({ earningsInfo }) => (
	<HStack justify="end" spacing={8}>
		<Text>
			Total insurable hours (15A): <b>{convertDecimal(earningsInfo?.totalInsurableHours || 0)}</b>
		</Text>
		<Text>
			Total insurable earnings (15B): <b>{getAmount(earningsInfo?.totalInsurableEarnings || 0)}</b>
		</Text>
	</HStack>
);

// ROE-01 tab 4: insurable earnings by pay period from the processed pay stubs
// (gross pay; hours = all paid hours), final pay period first.
const EarningsInfo = ({ formData, isLoading, sections, toggleSection, done, onConfirm }) => {
	const periods = formData?.earningsInfo?.earningsData || [];
	return (
		<Stack spacing={4} p={2}>
			<RoeSection
				title="Earnings Information"
				isOpen={sections.earnings}
				onToggle={() => toggleSection("earnings")}
				isDone={done.earnings}
				summary={`${periods.length} pay periods, ${getAmount(formData?.earningsInfo?.totalInsurableEarnings || 0)}`}
			>
				<Stack spacing={4}>
					{formData?.payPeriodTypeLabel && (
						<Text color="gray.600" fontSize="sm">
							Pay period type (block 6): {formData.payPeriodTypeLabel}. ROE PP 1 is the final pay period
							ending {formatPayDate(formData?.employmentInfo?.finalPayPeriodEndDate)}.
						</Text>
					)}
					{isLoading ? (
						<Spinner />
					) : periods.length ? (
						<EarningsTable periods={periods} />
					) : (
						<Alert status="warning" borderRadius="md">
							<AlertIcon />
							No processed pay found up to the final pay period. Process the final pay run first,
							then come back.
						</Alert>
					)}
					<EarningsTotals earningsInfo={formData?.earningsInfo} />
					<HStack justify="end">
						<Button
							bg="var(--banner_bg)"
							color="white"
							_hover={{ bg: "#4a2b4a" }}
							isDisabled={!periods.length}
							onClick={onConfirm}
						>
							Confirm
						</Button>
					</HStack>
				</Stack>
			</RoeSection>
		</Stack>
	);
};

export default EarningsInfo;
