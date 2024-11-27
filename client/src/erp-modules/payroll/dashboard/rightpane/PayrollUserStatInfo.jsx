import { Avatar, HStack, VStack } from "@chakra-ui/react";
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
					name: "Days till next",
					value: `${daysAgo(payGroupSchedule?.[closestRecordIndex + 1]?.payPeriodProcessingDate)}`,
				},
				approvalDate: {
					name: "Approval Date",
					value: formatDateMMDDYY(closestRecord?.payPeriodProcessingDate),
				},
				payDate: {
					name: "Payment Date",
					value: formatDateMMDDYY(closestRecord?.payPeriodPayDate),
				},
			});
		}
	}, [payGroupSchedule, closestRecord]);

	return (
		<>
			<VStack justify="center" align="center" mb="1" w={{ base: "auto", md: "106%" }} spacing={0}>
				<Avatar name={name} src={name} />
				<TextTitle title={name} />
				<NormalTextTitle size="xs" title={email} />
			</VStack>
			<HStack my={"3"} spacing={2} justify={"space-between"}>
				{stats.approvalDate &&
					Object.values(stats)?.map(({ name, value }) => (
						<VStack spacing={0} key={name}>
							<NormalTextTitle size="sm" title={name} />
							<TextTitle title={value} />
						</VStack>
					))}
			</HStack>
		</>
	);
};

export default PayrollUserStatInfo;
