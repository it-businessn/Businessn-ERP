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
			const isCurrentProcessed = payGroupSchedule?.[closestRecordIndex]?.isProcessed;
			const nextPayrun = isCurrentProcessed
				? payGroupSchedule?.[closestRecordIndex + 1]
				: payGroupSchedule?.[closestRecordIndex];

			const daysTillNextPayrun = daysAgo(nextPayrun?.payPeriodProcessingDate);
			const absoluteDaysNum = Math.abs(daysTillNextPayrun);

			const payRollDueDays = `${daysTillNextPayrun < 0 ? absoluteDaysNum : daysTillNextPayrun} day${
				absoluteDaysNum > 1 ? "s" : ""
			}`;

			setStats({
				dayTill: {
					name: `Next Payroll ${daysTillNextPayrun < 0 ? "overdue by" : "in"}`,
					value: payRollDueDays,
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
			{/* <VStack justify="center" align="center">
				<TextTitle title={name} />
				<NormalTextTitle size="sm" title={email} color="gray.500" />
			</VStack> */}
			<HStack justify="space-between">
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
