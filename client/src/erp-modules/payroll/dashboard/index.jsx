import { SimpleGrid } from "@chakra-ui/react";

import usePaygroup from "hooks/usePaygroup";
import PageLayout from "layouts/PageLayout";
import LocalStorageService from "services/LocalStorageService";
import LeftPane from "./leftpane";
import RightPane from "./rightpane";

const PayrollDashboard = () => {
  const loggedInUser = LocalStorageService.getItem("user");
  const company = LocalStorageService.getItem("selectedCompany");
  const {
    hasMultiPaygroups,
    payGroups,
    selectedPayGroup,
    closestRecord,
    payGroupSchedule,
    closestRecordIndex,
    selectedPayGroupOption,
    setSelectedPayGroupOption,
  } = usePaygroup(company, false);

  const handleChange = (value) => {
    if (value !== "") {
      setSelectedPayGroupOption(value);
    }
  };

  return (
    <PageLayout
      title=""
      showPayGroup={false}
      data={payGroups}
      selectAttr="name"
      selectPlaceholder="Select Paygroup"
      selectedValue={selectedPayGroupOption}
      handleChange={handleChange}
      // Responsive gutters: the fixed 7rem padding squeezed the three panes on
      // laptop widths and clipped the "Next Payroll" cards.
      p={{ base: "0.5rem", md: "1rem 1.5rem", "2xl": "1rem 4rem" }}
    >
      <SimpleGrid
        h={"100%"}
        columns={{ base: 1, md: 1, lg: 2 }}
        spacing={{ base: 4, lg: 10 }}
        // minmax(0, 1fr) lets the left pane shrink instead of overflowing
        templateColumns={{ lg: "minmax(0, 1fr) minmax(300px, 28%)" }}
      >
        <LeftPane
          company={company}
          closestRecord={closestRecord}
          payGroupSchedule={payGroupSchedule}
          closestRecordIndex={closestRecordIndex}
          selectedUser={loggedInUser}
        />
        <RightPane
          selectedUser={loggedInUser}
          selectedPayGroup={selectedPayGroup}
          payGroupSchedule={payGroupSchedule}
          closestRecord={closestRecord}
          closestRecordIndex={closestRecordIndex}
          company={company}
        />
      </SimpleGrid>
    </PageLayout>
  );
};

export default PayrollDashboard;
