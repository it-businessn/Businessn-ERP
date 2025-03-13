import { HStack, SimpleGrid, Stack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import TextTitle from "components/ui/text/TextTitle";
import VerticalStepper from "components/ui/VerticalStepper";
import { REASON_CODE, RECALL_OPTIONS } from "constant";
import useEmployeeEmploymentInfo from "hooks/useEmployeeEmploymentInfo";
import { useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import { getDefaultDate } from "utils/convertDate";
import StepContent from "../employees/pageview/step-content";

const EmploymentInfo = ({ company, handleNext, tabId }) => {
	const roeEmpId = LocalStorageService.getItem("roeEmpId");
	const initialFormData = {
		empId: "",
		employee: "",
		firstName: "",
		lastName: "",
		middleName: "",
		SIN: "",
		streetAddress: "",
		streetAddressSuite: "",
		city: "",
		province: "",
		country: "",
		positions: [],
	};

	const [formData, setFormData] = useState(initialFormData);

	const employmentInfo = useEmployeeEmploymentInfo(company, roeEmpId);

	const populateEmpInfo = () => {
		setFormData((prevData) => ({
			...prevData,
			firstName: employmentInfo?.firstName,
			lastName: employmentInfo?.lastName,
			middleName: employmentInfo?.middleName,
			SIN: employmentInfo?.SIN,
			streetAddress: employmentInfo?.streetAddress,
			streetAddressSuite: employmentInfo?.streetAddressSuite,
			city: employmentInfo?.city,
			province: employmentInfo?.province,
			country: employmentInfo?.country,
			postalCode: employmentInfo?.postalCode,
		}));
	};
	const steps = [
		{
			title: "Tenure",
			content: (
				<>
					<Stack w="50%" spacing={3}>
						<TextTitle title="Tenure" />
						<DateTimeFormControl
							w="40%"
							label="Start Date"
							valueText1={getDefaultDate(formData?.startDate)}
							name1="startDate"
							handleChange={(e) => {
								setFormData((prev) => ({
									...prev,
									startDate: e.target.value,
								}));
							}}
						/>
						<DateTimeFormControl
							w="40%"
							label="Last Day Worked"
							valueText1={getDefaultDate(formData?.endDate)}
							name1="endDate"
							handleChange={(e) => {
								setFormData((prev) => ({
									...prev,
									endDate: e.target.value,
								}));
							}}
						/>
						<HStack>
							<DateTimeFormControl
								label="Final Pay Period End Date"
								valueText1={getDefaultDate(formData?.finalPayDate)}
								name1="finalPayDate"
								handleChange={(e) => {
									setFormData((prev) => ({
										...prev,
										finalPayDate: e.target.value,
									}));
								}}
							/>
							<SelectFormControl
								valueParam="name"
								name="province"
								label="Expected Date of Recall"
								valueText={formData.province || ""}
								handleChange={(e) =>
									setFormData((prevData) => ({
										...prevData,
										province: e.target.value,
									}))
								}
								options={RECALL_OPTIONS}
							/>
							<DateTimeFormControl
								label="Recall Date"
								valueText1={getDefaultDate(formData?.finalPayDate)}
								name1="finalPayDate"
								handleChange={(e) => {
									setFormData((prev) => ({
										...prev,
										finalPayDate: e.target.value,
									}));
								}}
							/>
						</HStack>
						<SelectFormControl
							valueParam="name"
							name="province"
							label="Reason Code"
							valueText={formData.province || ""}
							handleChange={(e) =>
								setFormData((prevData) => ({
									...prevData,
									province: e.target.value,
								}))
							}
							options={REASON_CODE}
						/>
					</Stack>
					<PrimaryButton
						my={3}
						size="sm"
						name="Save"
						loadingText="Loading"
						onOpen={() => handleNext(tabId)}
					/>
				</>
			),
		},
	];
	const [currentStep, setCurrentStep] = useState(0);
	const goToNextStep = (index) => {
		setCurrentStep(index);
	};
	return (
		<SimpleGrid
			columns={{ base: 1, md: 1, lg: 2 }}
			spacing="4"
			mr="4"
			templateColumns={{ lg: "20% 80%" }}
		>
			<BoxCard>
				<VerticalStepper
					hideProgress
					steps={steps}
					currentStep={currentStep}
					handleClick={goToNextStep}
					// handleNext={()=>handleNext(id)}
					// isOnboarding={true}
				/>
			</BoxCard>
			<StepContent currentStep={currentStep} steps={steps} h="74vh" />
		</SimpleGrid>
	);
};

export default EmploymentInfo;
