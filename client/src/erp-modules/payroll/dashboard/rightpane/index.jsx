import BoxCard from "components/ui/card";
import ChatMessages from "erp-modules/sales/dashboard/rightpane/ChatMessages";
import MiniCalendar from "erp-modules/sales/dashboard/rightpane/MiniCalendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import PayrollUserStatInfo from "./PayrollUserStatInfo";
import { Box, VStack } from "@chakra-ui/react";

const RightPane = ({
  selectedUser,
  selectedPayGroup,
  company,
  payGroupSchedule,
  closestRecord,
  closestRecordIndex,
}) => {
  return (
    <BoxCard borderWidth="0" bg="#faf9f5">
      <VStack spacing={6} align="stretch">
       {/* <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
          <PayrollUserStatInfo
            name={selectedUser?.fullName}
            email={selectedUser?.email}
            payGroupSchedule={payGroupSchedule}
            closestRecord={closestRecord}
            closestRecordIndex={closestRecordIndex}
          />
        </Box>*/}

        <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
          <MiniCalendar user={selectedUser} company={company} isPayrollDashboard />
        </Box>

        <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
          <ChatMessages userId={selectedPayGroup?._id} company={company} />
        </Box>
      </VStack>
    </BoxCard>
  );
};

export default RightPane;
