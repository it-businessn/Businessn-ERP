import { HStack, SimpleGrid, Stack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import InputFormControl from "components/ui/form/InputFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import TextTitle from "components/ui/text/TextTitle";
import VerticalStepper from "components/ui/VerticalStepper";
import { COUNTRIES } from "config/payroll/employees/profileInfo";
import useCompanyEmployees from "hooks/useCompanyEmployees";
import useEmployeeProfileInfo from "hooks/useEmployeeProfileInfo";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import StepContent from "../employees/pageview/step-content";

const EmployeeInfo = ({ company, handleNext, tabId, deptName }) => {
	const employees = useCompanyEmployees(company, deptName);
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
		postalCode: "",
		companyName: company,
	};

	const [formData, setFormData] = useState(initialFormData);

	const empInfo = useEmployeeProfileInfo(company, formData.empId);
	const [provinces, setProvinces] = useState([]);

	useEffect(() => {
		if (formData?.country) {
			setProvinces(COUNTRIES.find(({ type }) => type === formData?.country)?.provinces);
		}
	}, [formData?.country]);

	const populateEmpInfo = () => {
		setFormData((prevData) => ({
			...prevData,
			firstName: empInfo?.firstName,
			lastName: empInfo?.lastName,
			middleName: empInfo?.middleName,
			SIN: empInfo?.SIN,
			streetAddress: empInfo?.streetAddress,
			streetAddressSuite: empInfo?.streetAddressSuite,
			city: empInfo?.city,
			province: empInfo?.province,
			country: empInfo?.country,
			postalCode: empInfo?.postalCode,
		}));
	};

	const handleConfirm = async () => {
		try {
			const { data } = await PayrollService.addEmployeeProfileInfo(formData);
			LocalStorageService.setItem("roeEmpId", data?.empId);
			handleNext(tabId);
		} catch (error) {}
	};

	const steps = [
		{
			title: "Choose Employee",
			content: (
				<>
					<TextTitle title="Choose Employee" />
					<SelectFormControl
						w="20%"
						valueParam="fullName"
						name="fullName"
						label=""
						placeholder="Select Employee"
						valueText={formData.employee || ""}
						handleChange={(e) => {
							const val = e.target.value;
							setFormData(() => ({
								employee: val,
								empId: employees?.find((_) => _.fullName === val)?._id,
								companyName: company,
							}));
						}}
						options={employees}
					/>
					<PrimaryButton
						my={3}
						size="sm"
						name="Confirm"
						loadingText="Loading"
						onOpen={populateEmpInfo}
					/>
				</>
			),
		},
		{
			title: "Personal Information",
			mt: 4,
			content: (
				<>
					<Stack w="50%">
						<TextTitle title="Personal Information" />
						<HStack mt={2}>
							<InputFormControl
								label="First Name"
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
								label="Middle Name"
								name="middleName"
								placeholder="Enter Middle Name"
								valueText={formData.middleName || ""}
								handleChange={(e) => {
									setFormData((prev) => ({
										...prev,
										middleName: e.target.value,
									}));
								}}
							/>
							<InputFormControl
								label="Last Name"
								name="lastName"
								placeholder="Enter Last Name"
								valueText={formData.lastName || ""}
								handleChange={(e) => {
									setFormData((prev) => ({
										...prev,
										lastName: e.target.value,
									}));
								}}
							/>
						</HStack>
						<InputFormControl
							w="40%"
							label="Social Insurance Number"
							subRequired
							name="SIN"
							placeholder="Enter SIN"
							valueText={formData.SIN || ""}
							handleChange={(e) => {
								setFormData((prev) => ({
									...prev,
									SIN: e.target.value,
								}));
							}}
						/>
						<TextTitle title="Address" />
						<InputFormControl
							w="40%"
							label="Street Address"
							name="streetAddress"
							placeholder="Enter Street Address"
							valueText={formData.streetAddress || ""}
							handleChange={(e) => {
								setFormData((prev) => ({
									...prev,
									streetAddress: e.target.value,
								}));
							}}
						/>
						<InputFormControl
							label="Suite"
							w="40%"
							name="streetAddressSuite"
							placeholder="Enter Suite"
							valueText={formData.streetAddressSuite || ""}
							handleChange={(e) => {
								setFormData((prev) => ({
									...prev,
									streetAddressSuite: e.target.value,
								}));
							}}
						/>
						<InputFormControl
							label="City"
							w="40%"
							name="city"
							placeholder="Enter City"
							valueText={formData.city || ""}
							handleChange={(e) => {
								setFormData((prev) => ({
									...prev,
									city: e.target.value,
								}));
							}}
						/>
						<SelectFormControl
							w="40%"
							valueParam="type"
							name="type"
							label="Country"
							valueText={formData.country || ""}
							handleChange={(e) =>
								setFormData((prevData) => ({
									...prevData,
									country: e.target.value,
								}))
							}
							options={COUNTRIES}
						/>
						<SelectFormControl
							w="40%"
							valueParam="name"
							name="province"
							label="Province / State"
							valueText={formData.province || ""}
							handleChange={(e) =>
								setFormData((prevData) => ({
									...prevData,
									province: e.target.value,
								}))
							}
							options={provinces}
						/>
						<InputFormControl
							label="Postal Code"
							required
							w="40%"
							name="postalCode"
							placeholder="Enter Postal Code"
							valueText={formData.postalCode || ""}
							handleChange={(e) => {
								setFormData((prev) => ({
									...prev,
									postalCode: e.target.value,
								}));
							}}
						/>
					</Stack>
					<PrimaryButton
						my={3}
						size="sm"
						name="Confirm"
						loadingText="Loading"
						onOpen={handleConfirm}
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

export default EmployeeInfo;
