import {
	Box,
	Flex,
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
import { tabPanelStyleCss, tabScrollCss } from "erp-modules/payroll/onboard-user/customInfo";
import { useEffect, useState } from "react";
import { FinalPayInfo } from "./FinalPayInfo";
import { OccupationInfo } from "./OccupationInfo";
import { OtherMoniesInfo } from "./OtherMoniesInfo";
import { SpecialPaymentsInfo } from "./SpecialPaymentsInfo";
import { StatPayInfo } from "./StatPayInfo";
import { TenureInfo } from "./TenureInfo";
import { VacationPayInfo } from "./VacationPayInfo";

export const employeeSubSteps = [
	{ title: "Tenure", description: "Personal Information" },
	{ title: "Occupation", description: "Emergency details" },
	{ title: "Final Pay", description: "Emergency details" },
];

const EmploymentInfo = ({
	formData,
	payGroupSchedule,
	handleFieldChange,
	employmentSubStep,
	setEmploymentSubStep,
}) => {
	const [roeData, setRoeData] = useState({
		statHolidays: [{ date: "", amount: "" }],
		otherMonies: [{ code: "", startDate: "", endDate: "", amount: "" }],
		specialPayments: [{ code: "", startDate: "", endDate: "", amount: "", period: "" }],
	});

	const handleArrayChange = (section, index, name, value) => {
		const arr = [...roeData[section]];
		arr[index][name] = value;
		setRoeData({ ...roeData, [section]: arr });
	};

	const addArrayRow = (section, template) => {
		setRoeData((prev) => ({ ...prev, [section]: [...prev[section], template] }));
	};

	const removeArrayRow = (section, index) => {
		const arr = [...roeData[section]];
		arr.splice(index, 1);
		setRoeData({ ...roeData, [section]: arr });
	};

	useEffect(() => {
		if (roeData?.statHolidays?.some((st) => st.date || st.amount)) {
			handleFieldChange("employmentInfo", "statHolidays", roeData?.statHolidays);
		}
	}, [roeData?.statHolidays]);

	useEffect(() => {
		if (roeData?.otherMonies?.some((om) => om.code || om.amount || om.startDate || om.endDate)) {
			handleFieldChange("employmentInfo", "otherMonies", roeData?.otherMonies);
		}
	}, [roeData?.otherMonies]);

	useEffect(() => {
		if (
			roeData?.specialPayments?.some(
				(sp) => sp.code || sp.amount || sp.startDate || sp.endDate || sp.period,
			)
		) {
			handleFieldChange("employmentInfo", "specialPayments", roeData?.specialPayments);
		}
	}, [roeData?.specialPayments]);

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
				<Stepper index={employmentSubStep} orientation="vertical" gap={8} sx={tabPanelStyleCss}>
					{employeeSubSteps.map(({ title }, index) => (
						<Step
							key={`step_num_${title}`}
							cursor="pointer"
							onClick={() => setEmploymentSubStep(index)}
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
				{employmentSubStep === 0 && (
					<TenureInfo
						payGroupSchedule={payGroupSchedule}
						handleFieldChange={handleFieldChange}
						formData={formData}
					/>
				)}
				{employmentSubStep === 1 && <OccupationInfo formData={formData} />}
				{employmentSubStep === 2 && (
					<Stack spacing={3} p={5}>
						<FinalPayInfo handleFieldChange={handleFieldChange} formData={formData} />
						<VacationPayInfo handleFieldChange={handleFieldChange} formData={formData} />
						<StatPayInfo
							roeData={roeData}
							setRoeData={setRoeData}
							handleArrayChange={handleArrayChange}
							removeArrayRow={removeArrayRow}
							addArrayRow={addArrayRow}
						/>
						<OtherMoniesInfo
							roeData={roeData}
							setRoeData={setRoeData}
							handleArrayChange={handleArrayChange}
							removeArrayRow={removeArrayRow}
							addArrayRow={addArrayRow}
						/>
						<SpecialPaymentsInfo
							roeData={roeData}
							setRoeData={setRoeData}
							handleArrayChange={handleArrayChange}
							removeArrayRow={removeArrayRow}
							addArrayRow={addArrayRow}
						/>
					</Stack>
				)}
			</Box>
		</Flex>
	);
};

export default EmploymentInfo;
