import { CalendarIcon, RepeatIcon, TimeIcon } from "@chakra-ui/icons";
import { Box, Center, HStack, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { daysAgo, formatDateMMDDYY } from "utils/convertDate";
import NormalTextTitle from "../../../../components/ui/NormalTextTitle";
import TextTitle from "../../../../components/ui/text/TextTitle";

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
						payGroupSchedule?.[closestRecordIndex + 1]?.payPeriodProcessingDate,
					)} days`,
					icon: RepeatIcon,
					iconColor: "gray.600",
				},
				approvalDate: {
					name: "Approval Date",
					value: formatDateMMDDYY(closestRecord?.payPeriodProcessingDate),
					icon: TimeIcon,
					iconColor: "gray.600",
				},
				payDate: {
					name: "Payment Date",
					value: formatDateMMDDYY(closestRecord?.payPeriodPayDate),
					icon: CalendarIcon,
					iconColor: "gray.600",
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
			<HStack spacing={8} justify="space-between" p={2}>
				{stats.approvalDate &&
					Object.values(stats)?.map(({ name, value, icon: Icon, iconColor }) => (
						<Box
							key={name}
							borderWidth="1px"
							borderRadius="lg"
							p={4}
							flex={1}
							boxShadow="sm"
							display="flex"
							alignItems="center"
							justifyContent="center"
							textAlign="center"
						>
							<VStack spacing={3} align="center" justify="center" width="100%" textAlign="center">
								<Center width="100%">
									<Icon boxSize={6} color={iconColor} />
								</Center>
								<Center width="100%">
									<NormalTextTitle
										size="sm"
										title={name}
										color="gray.700"
										textAlign="center"
										width="100%"
									/>
								</Center>
								<Center width="100%">
									<TextTitle title={value} textAlign="center" width="100%" />
								</Center>
							</VStack>
						</Box>
					))}
			</HStack>
		</>
	);
};

export default PayrollUserStatInfo;
