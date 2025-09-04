import {
	Box,
	Flex,
	FormLabel,
	HStack,
	Stack,
	Step,
	StepIcon,
	StepIndicator,
	StepNumber,
	Stepper,
	StepSeparator,
	StepStatus,
	StepTitle,
} from "@chakra-ui/react";
import BoxCard from "components/ui/card";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import { REASON_CODE, RECALL_OPTIONS } from "constant";
import { tabPanelStyleCss, tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import moment from "moment";
import { useEffect, useState } from "react";
import { getAmount } from "utils/convertAmt";
import { getDefaultDate } from "utils/convertDate";

const EmploymentInfo = ({ formData, setFormData, payGroupSchedule }) => {
	const [subStep, setSubStep] = useState(0);
	const RECALL_OPTIONS_WITH_DISABLED = RECALL_OPTIONS.map((opt) => {
		if (
			opt.name?.startsWith("Y") &&
			["E", "G", "M"].some((prefix) => formData?.employmentInfo?.reasonCode?.startsWith(prefix))
		) {
			return { ...opt, disabled: true };
		}
		return opt;
	});

	useEffect(() => {
		const finalPayPeriodRecord = payGroupSchedule?.find(
			({ payPeriodStartDate, payPeriodEndDate }) =>
				moment(formData?.employmentInfo?.employmentLeaveDate).isBetween(
					payPeriodStartDate,
					payPeriodEndDate,
					null,
					"[]",
				),
		);
		if (finalPayPeriodRecord)
			handleFieldChange(
				"employmentInfo",
				"finalPayPeriodEndDate",
				finalPayPeriodRecord?.payPeriodEndDate,
			);
	}, [formData?.employmentInfo?.employmentLeaveDate]);

	const handleFieldChange = (section, field, value) => {
		if (field === "reasonCode") {
			setFormData({
				...formData,
				[section]: {
					...formData[section],
					expectedRecallDate: "",
					reasonCode: value,
				},
			});
		} else {
			setFormData({
				...formData,
				[section]: {
					...formData[section],
					[field]: value,
				},
			});
		}
	};

	const subSteps = [
		{ title: "Tenure", description: "Personal Information" },
		{ title: "Occupation", description: "Emergency details" },
		{ title: "Final Pay", description: "Emergency details" },
	];
	return (
		<Flex height="100%">
			<Box
				display={{ base: "none", md: "flex" }}
				p={6}
				borderRight="1px solid"
				borderColor="gray.200"
				flex={0.2}
				bg="gray.50"
			>
				<Stepper index={subStep} orientation="vertical" gap={8} sx={tabPanelStyleCss}>
					{subSteps.map(({ title }, index) => (
						<Step
							key={`step_num_${title}`}
							cursor="pointer"
							onClick={() => setSubStep(index)}
							py={2}
						>
							<StepIndicator>
								<StepStatus
									complete={<StepIcon fontSize="1.2em" color="white" bg={"var(--banner_bg)"} />}
									incomplete={<StepNumber fontSize="1.1em" color={"var(--banner_bg)"} />}
									active={<StepNumber fontSize="1.1em" color="white" bg={"var(--banner_bg)"} />}
								/>
							</StepIndicator>
							<Box flexShrink="0" ml={3} whiteSpace="wrap">
								<StepTitle fontWeight={"bold"} mb={1}>
									{title}
								</StepTitle>
							</Box>
							<StepSeparator />
						</Step>
					))}
				</Stepper>
			</Box>
			<Box flex={{ base: 1, md: 0.7 }} overflowY="auto" css={tabScrollCss}>
				{subStep === 0 && (
					<Stack spacing={3} p={5}>
						<TextTitle size="xl" title={subSteps[subStep]?.title} />
						<HStack>
							<DateTimeFormControl
								label="Start Date"
								valueText1={getDefaultDate(formData?.employmentInfo?.employmentStartDate)}
								name1="employmentStartDate"
								handleChange={(e) =>
									handleFieldChange("employmentInfo", "employmentStartDate", e.target.value)
								}
							/>
							<DateTimeFormControl
								required
								label="Last Day Worked"
								valueText1={
									formData?.employmentInfo?.employmentLeaveDate
										? getDefaultDate(formData?.employmentInfo?.employmentLeaveDate)
										: ""
								}
								name1="employmentLeaveDate"
								handleChange={(e) =>
									handleFieldChange("employmentInfo", "employmentLeaveDate", e.target.value)
								}
							/>
						</HStack>
					</Stack>
				)}
				{subStep === 1 && (
					<Stack spacing={3} p={5}>
						<TextTitle size="xl" title={subSteps[subStep]?.title} />
						{formData?.employmentInfo?.positions?.map((position, index) => (
							<BoxCard key={`${position?.title}_${index}`} spacing={2}>
								<HStack>
									<FormLabel w="100%" fontWeight="bold">
										Position:
										<NormalTextTitle title={position?.title || ""} />
									</FormLabel>
									<FormLabel w="100%" fontWeight="bold">
										Payrate:
										<NormalTextTitle title={getAmount(position?.payRate) || ""} />
									</FormLabel>
								</HStack>

								<FormLabel>
									Linked Time Management Badge ID:
									<NormalTextTitle title={position?.timeManagementBadgeID || "NA"} />
								</FormLabel>
							</BoxCard>
						))}
					</Stack>
				)}
				{subStep === 2 && (
					<Stack spacing={3} p={5}>
						<TextTitle size="xl" title={subSteps[subStep]?.title} />
						<HStack>
							<DateTimeFormControl
								label="Final Pay Period End Date"
								valueText1={
									formData?.employmentInfo?.finalPayPeriodEndDate
										? getDefaultDate(formData?.employmentInfo?.finalPayPeriodEndDate)
										: ""
								}
								name1="finalPayPeriodEndDate"
								handleChange={(e) =>
									handleFieldChange("employmentInfo", "finalPayPeriodEndDate", e.target.value)
								}
							/>
							<SelectFormControl
								valueParam="name"
								name="reasonCode"
								label="Reason Code"
								placeholder="Select reason"
								valueText={formData?.employmentInfo?.reasonCode || ""}
								handleChange={(e) =>
									e.target.value &&
									handleFieldChange("employmentInfo", "reasonCode", e.target.value)
								}
								options={REASON_CODE}
							/>
						</HStack>
						<HStack>
							<SelectFormControl
								valueParam="name"
								name="expectedRecallDate"
								label="Expected Date of Recall"
								valueText={formData?.employmentInfo?.expectedRecallDate || ""}
								handleChange={(e) =>
									handleFieldChange("employmentInfo", "expectedRecallDate", e.target.value)
								}
								options={RECALL_OPTIONS_WITH_DISABLED}
							/>
							{formData?.employmentInfo?.expectedRecallDate?.startsWith("Y") && (
								<DateTimeFormControl
									required
									label="Recall Date"
									valueText1={
										formData?.employmentInfo?.recallDate
											? getDefaultDate(formData?.employmentInfo?.recallDate)
											: ""
									}
									name1="recallDate"
									handleChange={(e) =>
										handleFieldChange("employmentInfo", "recallDate", e.target.value)
									}
								/>
							)}
						</HStack>
					</Stack>
				)}
			</Box>
		</Flex>
	);
};

export default EmploymentInfo;
