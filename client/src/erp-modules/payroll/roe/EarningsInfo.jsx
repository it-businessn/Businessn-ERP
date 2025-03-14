import { HStack, IconButton, Stack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import usePaygroup from "hooks/usePaygroup";
import moment from "moment";
import { useEffect, useState } from "react";
import { BiMerge } from "react-icons/bi";

const EarningsInfo = ({ company, tabId, handleNext }) => {
	const { payGroupSchedule } = usePaygroup(company, true);
	const [earningsData, setEarningsData] = useState([]);
	const cols = ["ROE PP", "Payroll PP", "PP End Date", "Insurable Earnings", "Insurable Hours"];

	useEffect(() => {
		if (payGroupSchedule?.length) {
			setEarningsData(payGroupSchedule);
		}
	}, [payGroupSchedule]);

	const handleConfirm = () => {
		handleNext(tabId);
	};
	return (
		<BoxCard>
			<Stack spacing={3}>
				<TextTitle title="Period Information" />
				<HStack
					spacing={3}
					justifyContent="space-between"
					alignItems="baseline"
					height="50vh"
					overflow="auto"
				>
					<Table bg="var(--lead_cards_bg)" variant="simple">
						<Thead position="sticky" top={-1} zIndex={3}>
							<Tr>
								{cols?.map((col, index) => (
									<Th key={`${col}_${index}`} pl={index === 0 && "1em !important"}>
										<TextTitle size="md" title={col} />
									</Th>
								))}
							</Tr>
						</Thead>
						<Tbody>
							{earningsData?.map(({ payPeriod, payPeriodEndDate }, index) => (
								<Tr key={`${payPeriod}_${index + 1}`}>
									<Td py={0}>
										<NormalTextTitle title={index + 1} />
									</Td>

									<Td py={1}>
										<NormalTextTitle title={payPeriod} />
									</Td>
									<Td py={1}>
										<NormalTextTitle title={moment(payPeriodEndDate).format("YYYY-MM-DD")} />
									</Td>
									<Td py={1}>
										<NormalTextTitle title={0} />
									</Td>
									<Td py={1}>
										<NormalTextTitle title={0} />
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
					<IconButton
						ml={"1em"}
						size="sm"
						icon={<BiMerge />}
						aria-label="Refresh"
						variant="round"
					/>
					<Table bg="var(--lead_cards_bg)" variant="simple">
						<Thead position="sticky" top={-1} zIndex={3}>
							<Tr>
								{cols?.map((col, index) => (
									<Th key={`${col}_${index}`} pl={index === 0 && "1em !important"}>
										<TextTitle size="md" title={col} />
									</Th>
								))}
							</Tr>
						</Thead>
						<Tbody>
							{earningsData?.map(({ payPeriod, payPeriodEndDate }, index) => (
								<Tr key={`${payPeriod}_${index + 2}`}>
									<Td py={1}>
										<NormalTextTitle title={index + 1} />
									</Td>
									<Td py={1}>
										<NormalTextTitle title={payPeriod} />
									</Td>
									<Td py={1}>
										<NormalTextTitle title={moment(payPeriodEndDate).format("YYYY-MM-DD")} />
									</Td>
									<Td py={1}>
										<NormalTextTitle title={0} />
									</Td>
									<Td py={1}>
										<NormalTextTitle title={0} />
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</HStack>
				<Stack alignItems="end" w={"100%"}>
					<HStack alignItems="baseline">
						<TextTitle title="Total Insurable Hours:" whiteSpace="wrap" />
						<NormalTextTitle title="Period Information" />
					</HStack>
					<HStack alignItems="baseline">
						<TextTitle title="Total Insurable Hours:" whiteSpace="wrap" />
						<NormalTextTitle title="Period Information" />
					</HStack>
					<Stack>
						<PrimaryButton
							my={3}
							size="sm"
							name="Go Next"
							loadingText="Loading"
							onOpen={handleConfirm}
						/>
					</Stack>
				</Stack>
			</Stack>
		</BoxCard>
	);
};

export default EarningsInfo;
