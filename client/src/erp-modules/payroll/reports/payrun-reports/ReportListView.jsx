import { Box, Select } from "@chakra-ui/react";
import useCompany from "hooks/useCompany";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useBreakpointValue } from "services/Breakpoint";
import LocalStorageService from "services/LocalStorageService";
import { CURRENT_YEAR } from "utils/convertDate";
import { usePayrollReports } from "../../../../hooks/usePayrollReports";
import { tabScrollCss } from "../../onboard-user/customInfo";
import WorkviewTable from "../../workview/paygroup-header-table/WorkviewTable";
import { ReportModals } from "../components/ReportModals";

const ReportListView = () => {
	const { year } = useParams();
	const companyDetails = LocalStorageService.getItem("user")?.companyId;
	const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));

	const [yearsList, setYearsList] = useState([CURRENT_YEAR]);
	const [selectedYear, setSelectedYear] = useState(year || CURRENT_YEAR);

	const { isMobile } = useBreakpointValue();

	const {
		hasMultiPaygroups,
		selectedPayGroupOption,
		setSelectedPayGroupOption,
		payGroupSchedule,
		payGroups,
		closestRecordIndex,
		selectedPayGroup,
	} = usePaygroup(company, false, selectedYear, true);

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
	useEffect(() => {
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

	const handleChange = (value) => {
		if (value !== "") {
			setSelectedPayGroupOption(value);
		}
	};

	return (
		<PageLayout
			title="Payrun Reports"
			handleChange={handleChange}
			hasMultiPaygroups={hasMultiPaygroups}
			width={"35%"}
			showPayGroup={true}
			selectedValue={selectedPayGroupOption}
			data={payGroups}
			selectPlaceholder="Select Paygroup"
			selectAttr="name"
		>
			<Select
				float="right"
				w={"10%"}
				size={"sm"}
				border="1px solid var(--primary_button_bg)"
				borderRadius="10px"
				value={selectedYear}
				onChange={(e) => {
					if (e.target.value) setSelectedYear(e.target.value);
				}}
			>
				{yearsList?.map((year) => (
					<option value={year} key={year}>
						{year}
					</option>
				))}
			</Select>
			<Box bg="white" p={4} borderRadius="md" boxShadow="sm">
				{filteredPayPeriods && (
					<WorkviewTable
						css={tabScrollCss}
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
					companyDetails={companyDetails}
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
