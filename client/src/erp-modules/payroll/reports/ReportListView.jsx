import { Box, Select } from "@chakra-ui/react";
import useCompany from "hooks/useCompany";
import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useBreakpointValue } from "services/Breakpoint";
import LocalStorageService from "services/LocalStorageService";
import { CURRENT_YEAR } from "utils/convertDate";
import WorkviewTable from "../workview/paygroup-header-table/WorkviewTable";
import { usePayrollReports } from "./hooks/usePayrollReports";
import { ReportModals } from "./components/ReportModals";

const ReportListView = () => {
  const { year } = useParams();
  const { company } = useCompany(LocalStorageService.getItem("selectedCompany"));
  const [yearsList, setYearsList] = useState([CURRENT_YEAR]);
  const [selectedYear, setSelectedYear] = useState(year ?? CURRENT_YEAR);
  const { isMobile } = useBreakpointValue();

  const { payGroupSchedule, closestRecordIndex, selectedPayGroup } = usePaygroup(
    company,
    false,
    selectedYear,
    true
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
  } = usePayrollReports(company, selectedYear);

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
        <Select
          w="10%"
          size="sm"
          border="1px solid var(--primary_button_bg)"
          borderRadius="10px"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          mb={4}
        >
          {yearsList?.map((year) => (
            <option value={year} key={year}>
              {year}
            </option>
          ))}
        </Select>

        {filteredPayPeriods && (
          <WorkviewTable
            payGroupSchedule={filteredPayPeriods}
            closestRecordIndex={closestRecordIndex}
            height="calc(100vh - 192px)"
            handleRegister={(payNo, isExtra) => handleRegister(payNo, isExtra, payGroupSchedule)}
            selectedYear={selectedYear}
            handleTotalsReport={(payNo, isExtra) =>
              handleTotalsReport(payNo, isExtra, payGroupSchedule)
            }
            handleJournalsReport={(payNo, isExtra) =>
              handleJournalsReport(payNo, isExtra, payGroupSchedule)
            }
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
