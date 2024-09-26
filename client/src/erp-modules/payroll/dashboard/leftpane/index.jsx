import { Box, HStack, Icon, SimpleGrid, VStack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { useState } from "react";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "routes";
import { daysAgo, formatDateBar, formatDateRange, isExtraPay } from "utils";
import VerticalStepper from "../../../../components/ui/VerticalStepper";
import PayPeriodCard from "./PayPeriodCard";

const LeftPane = ({
	selectedPayGroup,
	setStats,
	company,
	closestRecord,
	payGroupSchedule,
	closestRecordIndex,
}) => {
	const steps = [
		{ title: "Approvals", description: "" }, //all (approved+rejected)/total timesheets
		{ title: "Outstanding Violations", description: "" }, //number of violation - 0%(with violation even 1) or 100% (complete)
		{ title: "Review Reports", description: "" }, //0
		{ title: "Submit", description: "" }, //0
	];
	const [currentStep, setCurrentStep] = useState(0);
	const goToNextStep = () => {
		setCurrentStep((prevStep) => prevStep + 1);
	};

	const navigate = useNavigate();
	const workviewPath = `${ROUTE_PATH.PAYROLL}${ROUTE_PATH.WORKVIEW}`;
	const handleClick = () => navigate(workviewPath);

	const prevSchedule =
		payGroupSchedule && payGroupSchedule[closestRecordIndex - 1];
	const nextSchedule =
		payGroupSchedule && payGroupSchedule[closestRecordIndex + 1];

	const runType = closestRecord?.isExtraRun ? "Extra" : "Regular";

	const sections = [
		{
			name: "Payroll",
			content: (
				<>
					<HStack gap={4} justifyContent={"space-around"}>
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
							title3={`In ${daysAgo(
								closestRecord?.payPeriodProcessingDate,
							)} days `}
						/>
						<PayPeriodCard
							schedule={nextSchedule}
							title1={`PP ${isExtraPay(
								nextSchedule?.payPeriod,
								nextSchedule?.isExtraRun,
							)}`}
							title2={`In ${daysAgo(
								nextSchedule?.payPeriodProcessingDate,
								true,
							)} days `}
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
						onOpen={handleClick}
					/>
				</>
			),
		},
		{
			name: "Pay period",
			content: (
				<VStack spacing={3} alignItems={"start"}>
					<HStack
						w={"100%"}
						justifyContent={"space-between"}
						alignItems={"start"}
					>
						<TextTitle title={"Employees"} />
						<VStack>
							<TextTitle align="end" title={"March 2024 (03/2024)"} />
							<NormalTextTitle align="end" title={"0 Payslips"} />
						</VStack>
					</HStack>
					<HStack
						w={"100%"}
						justifyContent={"space-between"}
						alignItems={"start"}
					>
						<TextTitle title={"Vacations"} />
						<VStack>
							<TextTitle align="end" title={"March 2024 (03/2024)"} />
							<NormalTextTitle align="end" title={"0 Payslips"} />
						</VStack>
					</HStack>
				</VStack>
			),
		},
		{
			name: "Payroll actions",
			content: (
				<VStack spacing={3} alignItems={"start"}>
					<HStack
						w={"100%"}
						justifyContent={"space-between"}
						color={"var(--nav_color)"}
						px="1em"
						bg={"var(--bg_color_1)"}
						border="3px solid var(--bg_color_1)"
						borderRadius="10px"
					>
						<VStack>
							<TextTitle title={"Overview of payroll process"} />
							<NormalTextTitle title={"Task progress of 200 employees"} />
						</VStack>
						<TextTitle
							title={"45%"}
							align="end"
							color={"var(--primary_button_bg)"}
						/>
					</HStack>
					<VerticalStepper steps={steps} currentStep={currentStep} />
				</VStack>
			),
		},
		{
			name: "Notifications",
			content: (
				<VStack spacing={3} alignItems={"start"}>
					<VStack spacing={1}>
						<TextTitle title={"Next public holiday"} />
						<NormalTextTitle title={"Sunday - Jul 4, 2024"} />
					</VStack>
					<VStack spacing={1}>
						<TextTitle title={"Next public holiday"} />
						<NormalTextTitle title={"Sunday - Jul 4, 2024"} />
					</VStack>
					<VStack spacing={1}>
						<TextTitle title={"Next public holiday"} />
						<NormalTextTitle title={"Sunday - Jul 4, 2024"} />
					</VStack>
				</VStack>
			),
		},
	];
	return (
		<Box>
			<SimpleGrid
				mb={"1em"}
				columns={{ base: 2 }}
				spacing="1em"
				color={"var(--menu_item_color)"}
			>
				{/* <TimeCard selectedUser={selectedUser} company={company} /> */}

				{sections.map(({ name, content }, index) => (
					<BoxCard key={name}>
						{index === 0 ? (
							<HStack>
								<TextTitle title={name} mt={2} mb={"1em"} />
								<HStack spacing={0}>
									<Icon
										borderRadius={"50%"}
										as={MdOutlineChevronLeft}
										// onClick={() => handleChangeDate("prev")}
										boxSize="5"
										color="fg.muted"
									/>

									<Icon
										as={MdOutlineChevronRight}
										// onClick={() => handleChangeDate("next")}
										boxSize="5"
										color="fg.muted"
									/>
								</HStack>
							</HStack>
						) : (
							<TextTitle title={name} mt={2} mb={"1em"} />
						)}

						{content}
					</BoxCard>
				))}
			</SimpleGrid>
		</Box>
	);
};

export default LeftPane;
