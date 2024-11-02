import { HStack, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { ROUTE_PATH } from "routes";
import { daysAgo, isExtraPay, longFormat, mmmDayYearFormat } from "utils";
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
						isPeriod
						bg="var(--payroll_card1)"
						color={"var(--lead_cards_bg)"}
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
					color={"var(--lead_cards_bg)"}
					bg={"var(--payroll_card2)"}
					border="3px solid var(--payroll_bg)"
					title1={`Pay Period ${isExtraPay(
						closestRecord?.payPeriod,
						closestRecord?.isExtraRun,
					)}`}
					// title2={runType.toUpperCase()}
					title3={daysAgo(closestRecord?.payPeriodProcessingDate)}
				/>
				<PayPeriodCard
					isPeriod
					bg={"var(--payroll_card3)"}
					color={"var(--lead_cards_bg)"}
					schedule={nextSchedule}
					title1={`Pay Period ${isExtraPay(
						nextSchedule?.payPeriod,
						nextSchedule?.isExtraRun,
					)}`}
					title2={`In ${daysAgo(nextSchedule?.payPeriodProcessingDate)} days `}
				/>
			</HStack>
			<HStack gap={3}>
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
