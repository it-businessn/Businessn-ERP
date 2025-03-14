import { HStack, IconButton, Stack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import moment from "moment";
import { useEffect, useState } from "react";
import { BiMerge } from "react-icons/bi";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import { convertDecimal, getAmount } from "utils/convertAmt";

const EarningsInfo = ({ company, tabId, handleNext }) => {
	const [earningsData, setEarningsData] = useState([]);
	const [totalInsurableHours, setTotalInsurableHours] = useState(0);
	const [totalInsurableEarnings, setTotalInsurableEarnings] = useState(0);
	const cols = ["ROE PP", "Payroll PP", "PP End Date", "Insurable Earnings", "Insurable Hours"];

	const roeEmpId = LocalStorageService.getItem("roeEmpId");
	useEffect(() => {
		const fetchEmpPayStubs = async () => {
			try {
				const { data } = await PayrollService.getEmpEarningInfo(company, roeEmpId);
				data.map(
					(_) =>
						(_.insurableHours =
							_?.totalRegHoursWorked +
							_?.totalOvertimeHoursWorked +
							_?.totalDblOvertimeHoursWorked +
							_?.totalSickHoursWorked +
							_?.totalSprayHoursWorked +
							_?.totalStatDayHoursWorked +
							_?.totalStatHours +
							_?.totalVacationHoursWorked +
							_?.totalFirstAidHoursWorked),
				);
				const totalHours = data?.reduce((acc, item) => {
					return acc + item?.insurableHours;
				}, 0);
				setTotalInsurableHours(totalHours);

				const totalEarnings = data?.reduce((acc, item) => {
					return acc + item?.currentGrossPay;
				}, 0);
				setTotalInsurableEarnings(totalEarnings);
				setEarningsData(data);
			} catch (error) {
				console.error(error);
			}
		};
		if (roeEmpId) fetchEmpPayStubs();
	}, [company]);

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
							{earningsData?.map(
								({ payPeriodNum, payPeriodEndDate, currentGrossPay, insurableHours }, index) => (
									<Tr key={`${payPeriodNum}_${index + 1}`}>
										<Td py={0}>
											<NormalTextTitle align="center" title={index + 1} />
										</Td>

										<Td py={1}>
											<NormalTextTitle align="center" title={payPeriodNum} />
										</Td>
										<Td py={1}>
											<NormalTextTitle
												align="center"
												title={moment(payPeriodEndDate).format("YYYY-MM-DD")}
											/>
										</Td>
										<Td py={1}>
											<NormalTextTitle align="center" title={getAmount(currentGrossPay)} />
										</Td>
										<Td py={1}>
											<NormalTextTitle align="center" title={convertDecimal(insurableHours)} />
										</Td>
									</Tr>
								),
							)}
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
							{earningsData?.map(
								({ payPeriodNum, payPeriodEndDate, currentGrossPay, insurableHours }, index) => (
									<Tr key={`${payPeriodNum}_${index + 1}`}>
										<Td py={0}>
											<NormalTextTitle align="center" title={index + 1} />
										</Td>

										<Td py={1}>
											<NormalTextTitle align="center" title={payPeriodNum} />
										</Td>
										<Td py={1}>
											<NormalTextTitle
												align="center"
												title={moment(payPeriodEndDate).format("YYYY-MM-DD")}
											/>
										</Td>
										<Td py={1}>
											<NormalTextTitle align="center" title={getAmount(currentGrossPay)} />
										</Td>
										<Td py={1}>
											<NormalTextTitle align="center" title={convertDecimal(insurableHours)} />
										</Td>
									</Tr>
								),
							)}
						</Tbody>
					</Table>
				</HStack>
				<Stack alignItems="end" w={"100%"}>
					<HStack alignItems="start" w="20%" justifyContent="space-between">
						<TextTitle title="Total Insurable Hours:" whiteSpace="wrap" />
						<NormalTextTitle title={convertDecimal(totalInsurableHours)} />
					</HStack>
					<HStack alignItems="start" w="20%" justifyContent="space-between">
						<TextTitle title="Total Insurable Dollars:" whiteSpace="wrap" />
						<NormalTextTitle title={getAmount(totalInsurableEarnings)} />
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
