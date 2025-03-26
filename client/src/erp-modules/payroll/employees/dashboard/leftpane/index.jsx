import { Box, SimpleGrid } from "@chakra-ui/react";

import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import PreviewReportsModal from "erp-modules/payroll/process-payroll/preview-reports/PreviewReportsModal";
import { EARNING_TABLE_COLS } from "erp-modules/payroll/workview/data";
import WorkviewTable from "erp-modules/payroll/workview/paygroup-header-table/WorkviewTable";
import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";
import { getPayNum, sortRecordsByDate } from "utils";
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
			>
				<BoxCard>
					<TextTitle title={"Earning Statement"} />
					<WorkviewTable
						isEarningTable
						cols={EARNING_TABLE_COLS}
						payGroupSchedule={empPayStub}
						height="30vh"
						viewLabel="View Paystub"
						handleRegister={handleRegister}
						textAlign={"center"}
					/>
				</BoxCard>
				<BoxCard>
					<TextTitle title="Year End Forms" />
				</BoxCard>
			</SimpleGrid>
			{showReport && (
				<PreviewReportsModal
					isReport
					size="5xl"
					isOpen={showReport}
					onClose={() => setShowReport(false)}
					reportData={payStub}
					isEarningTable
					title={""}
				/>
			)}
		</Box>
	);
};

export default LeftPane;
