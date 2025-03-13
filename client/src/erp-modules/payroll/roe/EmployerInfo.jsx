import { HStack, SimpleGrid, Stack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import InputFormControl from "components/ui/form/InputFormControl";
import RadioFormControl from "components/ui/form/RadioFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import VerticalStepper from "components/ui/VerticalStepper";
import { RECALL_OPTIONS } from "constant";
import useEmployeeEmploymentInfo from "hooks/useEmployeeEmploymentInfo";
import { useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import StepContent from "../employees/pageview/step-content";

const EmployerInfo = ({ company, handleNext, tabId }) => {
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
			title: "Employer Details",
			content: (
				<>
					<Stack w="50%" spacing={3}>
						<HStack>
							<Stack>
								<TextTitle title="Employer Name" />
								<NormalTextTitle title="Tenure" />
							</Stack>
							<Stack>
								<TextTitle title="Employer Address" />
								<NormalTextTitle title="Tenure" />
								<NormalTextTitle title="Tenure" />
								<NormalTextTitle title="Tenure" />
								<NormalTextTitle title="Tenure" />
							</Stack>
							<Stack>
								<TextTitle title="CRA Payroll Account Number" />
								<NormalTextTitle title="Tenure" />
							</Stack>
						</HStack>

						<HStack>
							<Stack>
								<TextTitle title="Contact Name" />
								<SelectFormControl
									valueParam="name"
									name="province"
									label=""
									valueText={formData.province || ""}
									handleChange={(e) =>
										setFormData((prevData) => ({
											...prevData,
											province: e.target.value,
										}))
									}
									options={RECALL_OPTIONS}
								/>
							</Stack>
							<Stack>
								<TextTitle title="Contact Telephone Number" />
								<HStack>
									<InputFormControl
										type="number"
										label=""
										name="firstName"
										placeholder="Enter First Name"
										valueText={formData.firstName || ""}
										handleChange={(e) => {
											setFormData((prev) => ({
												...prev,
												firstName: e.target.value,
											}));
										}}
									/>
									<InputFormControl
										label=""
										name="firstName"
										placeholder="Enter First Name"
										valueText={formData.firstName || ""}
										handleChange={(e) => {
											setFormData((prev) => ({
												...prev,
												firstName: e.target.value,
											}));
										}}
									/>
								</HStack>
							</Stack>
						</HStack>
						<HStack>
							<Stack>
								<TextTitle title="Issuer Name" />
								<SelectFormControl
									valueParam="name"
									name="province"
									label=""
									valueText={formData.province || ""}
									handleChange={(e) =>
										setFormData((prevData) => ({
											...prevData,
											province: e.target.value,
										}))
									}
									options={RECALL_OPTIONS}
								/>
							</Stack>
							<Stack>
								<TextTitle title="Issuer Telephone Number" />
								<HStack>
									<InputFormControl
										type="number"
										label=""
										name="firstName"
										placeholder="Enter First Name"
										valueText={formData.firstName || ""}
										handleChange={(e) => {
											setFormData((prev) => ({
												...prev,
												firstName: e.target.value,
											}));
										}}
									/>
									<InputFormControl
										label=""
										name="firstName"
										placeholder="Enter First Name"
										valueText={formData.firstName || ""}
										handleChange={(e) => {
											setFormData((prev) => ({
												...prev,
												firstName: e.target.value,
											}));
										}}
									/>
								</HStack>
							</Stack>
						</HStack>
						<RadioFormControl
							label="Preferred Communication"
							// handleChange={handleRadioChange}
							options={[
								{ name: "English", value: "English" },
								{ name: "French", value: "French" },
							]}
						/>
					</Stack>
					<PrimaryButton
						my={3}
						size="sm"
						name="Confirm"
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

export default EmployerInfo;
