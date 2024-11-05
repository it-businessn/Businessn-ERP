import { HStack } from "@chakra-ui/react";
import { daysAgo, isExtraPay, longFormat } from "utils";
import PayPeriodCard from "./PayPeriodCard";
import PayPeriodDetailCard from "./PayPeriodDetailCard";

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
						isPeriod
						schedule={prevSchedule}
						title1={`Pay Period ${isExtraPay(
							prevSchedule?.payPeriod,
							prevSchedule?.isExtraRun,
						)}`}
						title2={`${daysAgo(
							prevSchedule?.payPeriodProcessingDate,
						)} days ago`}
					/>
				)}

				<PayPeriodCard
					isPeriod
					schedule={closestRecord}
					title1={`Pay Period ${isExtraPay(
						closestRecord?.payPeriod,
						closestRecord?.isExtraRun,
					)}`}
					title3={`${daysAgo(closestRecord?.payPeriodProcessingDate)}`}
				/>
				<PayPeriodCard
					isPeriod
					schedule={nextSchedule}
					title1={`Pay Period ${isExtraPay(
						nextSchedule?.payPeriod,
						nextSchedule?.isExtraRun,
					)}`}
					title2={`In ${daysAgo(nextSchedule?.payPeriodProcessingDate)} days `}
				/>
			</HStack>

			<PayPeriodDetailCard
				header={"Pay Period"}
				text1={`${longFormat(closestRecord?.payPeriodStartDate)} - `}
				text2={longFormat(closestRecord?.payPeriodEndDate)}
				actionText="Manage Payroll"
				handleClick={() => console.log("handleClick")}
			/>
			<PayPeriodDetailCard
				header={"Processing Date"}
				text1={longFormat(closestRecord?.payPeriodProcessingDate)}
				actionText="Pending"
				handleClick={() => console.log("handleClick")}
			/>
			<PayPeriodDetailCard
				header={"Pay Date"}
				text1={longFormat(closestRecord?.payPeriodPayDate)}
				actionText="View Register"
				handleClick={() => console.log("handleClick")}
			/>
			{/* <HStack gap={3}>
				<VStack
					spacing={0}
					color="var(--nav_color)"
					py="1em"
					px={1}
					w={"100%"}
					bg="var(--main_color)"
					borderRadius="10px"
				>
					<TextTitle title="Pay Period" size={"1.25em"} align={"center"} />
					<HStack w={"100%"} spacing={0} justifyContent={"space-between"}>
						<NormalTextTitle
							weight="500"
							align={"center"}
							size="lg"
							title={mmmDayYearFormat(closestRecord?.payPeriodStartDate)}
						/>
						<TextTitle title={"to"} width="60px" align={"center"} />
						<NormalTextTitle
							weight="500"
							size="lg"
							align={"center"}
							title={mmmDayYearFormat(closestRecord?.payPeriodEndDate)}
						/>
					</HStack>
				</VStack>

				<PayPeriodCard
					isPeriod
					bg="var(--main_color)"
					schedule={closestRecord}
					title1="Pay Day"
					title2={
						<NormalTextTitle
							width={"100%"}
							size="lg"
							title={longFormat(closestRecord?.payPeriodPayDate)}
							weight={"500"}
						/>
					}
				/>
			</HStack> */}
		</>
	);
};

export default PayrollCard;
