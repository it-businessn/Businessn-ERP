import { Box, SimpleGrid, VStack } from "@chakra-ui/react";

import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import { tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import PreviewReportsModal from "erp-modules/payroll/reports/PreviewReportsModal";
import { EARNING_TABLE_COLS } from "erp-modules/payroll/workview/data";
import WorkviewTable from "erp-modules/payroll/workview/paygroup-header-table/WorkviewTable";
import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";
import { getPayNum, isExtraPay, sortRecordsByDate } from "utils";
import { dayMonthYear, formatDateRange } from "utils/convertDate";
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
			<SimpleGrid mb="1em" columns={{ base: 1 }} spacing="1em" color="var(--menu_item_color)">
				<EmployeeTimeCard isMobile={isMobile} selectedUser={selectedUser} company={company} />
			</SimpleGrid>
			<SimpleGrid
				mb={"1em"}
				columns={{ base: 1, md: 1, lg: 2 }}
				spacing="1em"
				color={"var(--menu_item_color)"}
				templateColumns={{ lg: "60% 40%" }}
			>
				<BoxCard>
					<TextTitle title={"Earning Statement"} />
					{isMobile ? (
						empPayStub?.map(
							({
								payPeriodNum,
								_id,
								payPeriod,
								isExtraRun,
								payPeriodPayDate,
								payPeriodStartDate,
								payPeriodEndDate,
							}) => (
								<BoxCard mt={3} key={_id}>
									<VStack alignItems="start">
										<TextTitle
											title={`Pay number: ${isExtraPay(payPeriodNum || payPeriod, isExtraRun)}`}
										/>
										<TextTitle title={`Pay date: ${dayMonthYear(payPeriodPayDate)}`} />
										<TextTitle title={`Pay period-`} />
										<TextTitle title={formatDateRange(payPeriodStartDate, payPeriodEndDate)} />
										<PrimaryButton
											size="xs"
											name="View"
											onOpen={() =>
												handleRegister(
													isExtraPay(payPeriodNum || payPeriod, isExtraRun),
													isExtraRun,
												)
											}
										/>
									</VStack>
								</BoxCard>
							),
						)
					) : (
						<WorkviewTable
							isEarningTable
							cols={EARNING_TABLE_COLS}
							payGroupSchedule={empPayStub}
							height="calc(100vh - 743px)"
							css={tabScrollCss}
							viewLabel="View Paystub"
							handleRegister={handleRegister}
							textAlign={"center"}
						/>
					)}
				</BoxCard>
				{!isMobile && (
					<BoxCard>
						<TextTitle title="Year End Forms" />
					</BoxCard>
				)}
			</SimpleGrid>
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
