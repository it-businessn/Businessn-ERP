import { HStack, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { daysAgo, formatDateMMDDYY } from "utils/convertDate";
import NormalTextTitle from "../../../../components/ui/NormalTextTitle";
import TextTitle from "../../../../components/ui/text/TextTitle";
import { CalendarIcon, TimeIcon, RepeatIcon } from "@chakra-ui/icons";

const PayrollUserStatInfo = ({
  name,
  email,
  payGroupSchedule,
  closestRecord,
  closestRecordIndex,
}) => {
  const payrollDashboardStat = {
    dayTill: null,
    approvalDate: null,
    payDate: null,
  };

  const [stats, setStats] = useState(payrollDashboardStat);

  useEffect(() => {
    if (payGroupSchedule && closestRecord) {
      setStats({
        dayTill: {
          name: "Next Payroll in",
          value: `${daysAgo(
            payGroupSchedule?.[closestRecordIndex + 1]?.payPeriodProcessingDate
          )} days`,
          icon: RepeatIcon,
          bg: "blue.50",
          iconColor: "blue.500",
        },
        approvalDate: {
          name: "Approval Date",
          value: formatDateMMDDYY(closestRecord?.payPeriodProcessingDate),
          icon: TimeIcon,
          bg: "purple.50",
          iconColor: "purple.500",
        },
        payDate: {
          name: "Payment Date",
          value: formatDateMMDDYY(closestRecord?.payPeriodPayDate),
          icon: CalendarIcon,
          bg: "green.50",
          iconColor: "green.500",
        },
      });
    }
  }, [payGroupSchedule, closestRecord]);

  return (
    <>
      <VStack justify="center" align="center" mb={4} spacing={1}>
        <TextTitle title={name} />
        <NormalTextTitle size="sm" title={email} color="gray.500" />
      </VStack>
      <HStack spacing={4} justify="space-between" bg="white" p={4} borderRadius="lg">
        {stats.approvalDate &&
          Object.values(stats)?.map(({ name, value, icon: Icon, bg, iconColor }) => (
            <VStack
              key={name}
              spacing={1}
              flex={1}
              p={4}
              borderRadius="md"
              bg={bg}
              _hover={{ transform: "translateY(-2px)", transition: "all 0.2s" }}
            >
              <Icon boxSize={6} color={iconColor} mb={2} />
              <NormalTextTitle size="sm" title={name} color="gray.700" />
              <TextTitle title={value} />
            </VStack>
          ))}
      </HStack>
    </>
  );
};

export default PayrollUserStatInfo;
