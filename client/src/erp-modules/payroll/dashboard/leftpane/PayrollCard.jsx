import { HStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import { ROUTE_PATH } from "routes";
import { daysAgo, formatDateBar, formatDateRange, isExtraPay } from "utils";
import PayPeriodCard from "./PayPeriodCard";

const PayrollCard = ({
	prevSchedule,
	closestRecord,
	runType,
	nextSchedule,
	handleClick,
}) => {
	return (
		<>
			<HStack gap={4} justifyContent={"space-around"}>
				{prevSchedule && (
					<PayPeriodCard
						schedule={prevSchedule}
						title1={`PP ${isExtraPay(
							prevSchedule?.payPeriod,
							prevSchedule?.isExtraRun,
						)}`}
						title2={`${daysAgo(
							prevSchedule?.payPeriodProcessingDate,
						)} days ago`}
					/>
				)}

				<PayPeriodCard
					schedule={closestRecord}
					color={"var(--lead_cards_bg)"}
					bg={"var(--payroll_bg)"}
					border="3px solid var(--payroll_bg)"
					title1={`PP ${isExtraPay(
						closestRecord?.payPeriod,
						closestRecord?.isExtraRun,
					)}`}
					title2={runType.toUpperCase()}
					title3={`In ${daysAgo(closestRecord?.payPeriodProcessingDate)} days `}
				/>
				<PayPeriodCard
					schedule={nextSchedule}
					title1={`PP ${isExtraPay(
						nextSchedule?.payPeriod,
						nextSchedule?.isExtraRun,
					)}`}
					title2={`In ${daysAgo(nextSchedule?.payPeriodProcessingDate)} days `}
				/>
			</HStack>
			<HStack gap={4}>
				<PayPeriodCard
					schedule={closestRecord}
					title1="Pay date"
					title2={formatDateBar(closestRecord?.payPeriodPayDate)}
				/>
				<PayPeriodCard
					schedule={closestRecord}
					title1="Pay period"
					title2={`${formatDateRange(
						closestRecord?.payPeriodStartDate,
						closestRecord?.payPeriodEndDate,
					)}`}
				/>
			</HStack>
			<PrimaryButton
				minW={"100%"}
				name={"Manage payroll"}
				loadingText="Loading"
				onOpen={() =>
					handleClick(`${ROUTE_PATH.PAYROLL}${ROUTE_PATH.WORKVIEW}`)
				}
			/>
		</>
	);
};

export default PayrollCard;
