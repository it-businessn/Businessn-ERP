import { Box, SimpleGrid } from "@chakra-ui/react";

import { Tbody, Td, Tr } from "@chakra-ui/react";
import OutlineButton from "components/ui/button/OutlineButton";
import BoxCard from "components/ui/card";
import EmptyRowRecord from "components/ui/EmptyRowRecord";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TableLayout from "components/ui/table/TableLayout";
import TextTitle from "components/ui/text/TextTitle";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import PreviewReportsModal from "erp-modules/payroll/reports/PreviewReportsModal";
import { EARNING_TABLE_COLS } from "erp-modules/payroll/workview/data";
import WorkviewTable from "erp-modules/payroll/workview/paygroup-header-table/WorkviewTable";
import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";
import { getPayNum, isExtraPay, sortRecordsByDate } from "utils";
import { dayMonthYear, formatDateBar } from "utils/convertDate";
import EmployeeTimeCard from "./EmployeeTimeCard";

const LeftPane = ({ selectedUser, company, isMobile }) => {
	const [empPayStub, setEmpPayStub] = useState(null);
	const [showReport, setShowReport] = useState(false);
	const [payStub, setPayStub] = useState(null);

	useEffect(() => {
		const fetchEmpPayStubs = async () => {
			try {
				const { data } = await PayrollService.getEmpPayReportDetails(company, selectedUser._id);
				const sortedResult = sortRecordsByDate(data, "payPeriodNum", false, false);
				setEmpPayStub(sortedResult);
			} catch (error) {
				console.error(error);
			}
		};
		fetchEmpPayStubs();
	}, []);

	const handleRegister = (payNo, isExtra) => {
		const record = getPayNum(payNo, isExtra, empPayStub);
		setPayStub(record);
		setShowReport(true);
	};

	return (
		<Box>
			<SimpleGrid
				mb={{ base: "0.5em", md: "1em" }}
				columns={{ base: 1 }}
				spacing="1em"
				color="var(--menu_item_color)"
			>
				<EmployeeTimeCard isMobile={isMobile} selectedUser={selectedUser} company={company} />
			</SimpleGrid>
			{isMobile ? (
				<BoxCard p={{ base: "0 0.5em", md: "1em" }} width="100%">
					<TextTitle size={"sm"} title={"Earning Statement"} />
					<TableLayout
						cols={["Pay#", "Pay Date", "Pay period", "Action"]}
						isSmall
						w="100%"
						position="sticky"
						zIndex={3}
						top={-1}
						textAlign="center"
						minH={{ base: "auto", md: "15vh" }}
						height={{ base: "200px", md: "15vh" }}
						css={tabScrollCss}
					>
						<Tbody>
							{(!empPayStub || empPayStub?.length === 0) && (
								<EmptyRowRecord px={0} data={empPayStub} colSpan={empPayStub?.length} />
							)}
							{empPayStub?.map(
								({
									payPeriodNum,
									_id,
									payPeriod,
									isExtraRun,
									payPeriodPayDate,
									payPeriodStartDate,
									payPeriodEndDate,
								}) => (
									<Tr key={_id} _hover={{ bg: "var(--phoneCall_bg_light)" }}>
										<Td p={0.5}>
											<TextTitle
												align={"center"}
												size={{ base: "xs", md: "sm" }}
												title={isExtraPay(payPeriodNum || payPeriod, isExtraRun)}
											/>
										</Td>
										<Td p={0.5}>
											<NormalTextTitle
												size={{ base: "xs", md: "sm" }}
												title={dayMonthYear(payPeriodPayDate)}
											/>
										</Td>
										<Td p={0.5}>
											<NormalTextTitle
												size={{ base: "xs", md: "sm" }}
												title={`${formatDateBar(payPeriodStartDate)} - ${formatDateBar(
													payPeriodEndDate,
												)}`}
											/>
										</Td>
										<Td p={0.5}>
											<OutlineButton
												size="xs"
												label="View"
												h={"22px"}
												minH={"auto"}
												onClick={() =>
													handleRegister(
														isExtraPay(payPeriodNum || payPeriod, isExtraRun),
														isExtraRun,
													)
												}
											/>
										</Td>
									</Tr>
								),
							)}
						</Tbody>
					</TableLayout>
				</BoxCard>
			) : (
				<SimpleGrid
					mb={"1em"}
					mr={"1em"}
					columns={{ base: 1, md: 1, lg: 2 }}
					spacing="1em"
					color={"var(--menu_item_color)"}
					templateColumns={{ lg: "60% 40%" }}
				>
					<BoxCard>
						<TextTitle size={"sm"} title={"Earning Statement"} />
						<WorkviewTable
							isEarningTable
							cols={EARNING_TABLE_COLS}
							payGroupSchedule={empPayStub}
							height="calc(100vh - 700px)"
							css={tabScrollCss}
							viewLabel="View Paystub"
							handleRegister={handleRegister}
							textAlign={"center"}
						/>
					</BoxCard>
					<BoxCard>
						<TextTitle size={"sm"} title="Year End Forms" />
					</BoxCard>
				</SimpleGrid>
			)}
			{showReport && (
				<PreviewReportsModal
					isMobile={isMobile}
					isReport
					size="5xl"
					isOpen={showReport}
					onClose={() => setShowReport(false)}
					reportData={payStub}
					isEarningTable
					title={"PaySlip"}
				/>
			)}
		</Box>
	);
};

export default LeftPane;
