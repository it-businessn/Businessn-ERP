import { Box, Flex, Select } from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import useCompany from "hooks/useCompany";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useBreakpointValue } from "services/Breakpoint";
import LocalStorageService from "services/LocalStorageService";
import { CURRENT_YEAR } from "utils/convertDate";
import WorkviewTable from "../workview/paygroup-header-table/WorkviewTable";
import { ReportModals } from "./components/ReportModals";
import { usePayrollReports } from "./hooks/usePayrollReports";

const ReportListView = () => {
	const { year } = useParams();
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
	const [yearsList, setYearsList] = useState([CURRENT_YEAR]);
	const [selectedYear, setSelectedYear] = useState(year || CURRENT_YEAR);
	const { isMobile } = useBreakpointValue();

	const { payGroupSchedule, closestRecordIndex, selectedPayGroup } = usePaygroup(
		company,
		false,
		selectedYear,
		true,
	);

	const {
		showReport,
		showTotalsReport,
		showJournalsReport,
		hasLoaded,
		totalsReport,
		journalReport,
		reportData,
		handleRegister,
		handleTotalsReport,
		handleJournalsReport,
		closeReports,
	} = usePayrollReports(company, selectedYear, payGroupSchedule, selectedPayGroup);

	// Update years list when paygroup changes
	useState(() => {
		if (selectedPayGroup) {
			setYearsList(selectedPayGroup?.yearSchedules.map(({ year }) => year));
		}
	}, [selectedPayGroup]);

	// Filter and sort pay periods
	const filteredPayPeriods = (
		closestRecordIndex
			? payGroupSchedule?.filter((_, index) => index <= closestRecordIndex || _?.isProcessed)
			: payGroupSchedule
	)?.sort((a, b) => new Date(b.payPeriodPayDate) - new Date(a.payPeriodPayDate));

	return (
		<PageLayout title="Payrun Reports">
			<Box bg="white" p={4} borderRadius="md" boxShadow="sm">
				<Flex gap={3} mb={4}>
					<TextTitle
						weight="normal"
						p={1}
						width="200px"
						size="sm"
						borderRadius="10px"
						border="1px solid var(--primary_button_bg)"
						title={selectedPayGroup?.name}
					/>
					<Select
						w={"10%"}
						size={"sm"}
						border="1px solid var(--primary_button_bg)"
						borderRadius="10px"
						value={selectedYear}
						onChange={(e) => setSelectedYear(e.target.value)}
					>
						{yearsList?.map((year) => (
							<option value={year} key={year}>
								{year}
							</option>
						))}
					</Select>
				</Flex>

				{filteredPayPeriods && (
					<WorkviewTable
						payGroupSchedule={filteredPayPeriods}
						closestRecordIndex={closestRecordIndex}
						height="calc(100vh - 225px)"
						handleRegister={handleRegister}
						selectedYear={selectedYear}
						handleTotalsReport={handleTotalsReport}
						handleJournalsReport={handleJournalsReport}
					/>
				)}
				<ReportModals
					hasLoaded={hasLoaded}
					showReport={showReport}
					showTotalsReport={showTotalsReport}
					showJournalsReport={showJournalsReport}
					reportData={reportData}
					totalsReport={totalsReport}
					journalReport={journalReport}
					company={company}
					isMobile={isMobile}
					onClose={closeReports}
				/>
			</Box>
		</PageLayout>
	);
};

export default ReportListView;
