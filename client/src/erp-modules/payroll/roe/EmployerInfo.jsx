import { Box, HStack, SimpleGrid, Stack } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import InputFormControl from "components/ui/form/InputFormControl";
import RadioFormControl from "components/ui/form/RadioFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import VerticalStepper from "components/ui/VerticalStepper";
import useSelectedCompanyInfo from "hooks/useSelectedCompanyInfo";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import UserService from "services/UserService";
import StepContent from "../employees/pageview/step-content";

const EmployerInfo = ({ company, handleNext, tabId }) => {
	const roeEmpId = LocalStorageService.getItem("roeEmpId");
	const loggedInUser = LocalStorageService.getItem("user");
	const [roeInfo, setRoeInfo] = useState(null);
	const [admins, setAdmins] = useState(null);
	const companyInfo = useSelectedCompanyInfo(company);

	const initialFormData = {
		empId: roeEmpId,
		name: "",
		registration_number: "",
		address: "",
		contactName: loggedInUser?.fullName,
		issuerName: loggedInUser?.fullName,
		contactTelNumber: "",
		contactExtNumber: "",
		issuerTelNumber: "",
		issuerExtNumber: "",
		preferredCommunication: "English",
		companyName: company,
	};

	const [formData, setFormData] = useState(initialFormData);

	useEffect(() => {
		const fetchEmployeeROEEmploymentInfo = async () => {
			try {
				const { data } = await PayrollService.getEmployeeROEEmploymentInfo(company, roeEmpId);
				setRoeInfo(data);
			} catch (error) {
				console.error(error);
			}
		};
		const fetchAllAdmins = async () => {
			try {
				const { data } = await UserService.getAllManagers(company);
				data?.map((emp) => (emp.fullName = emp?.empId?.fullName));
				setAdmins(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllAdmins();
		fetchEmployeeROEEmploymentInfo();
	}, []);

	useEffect(() => {
		if (companyInfo)
			setFormData((prevData) => ({
				...prevData,
				name: companyInfo?.name,
				registration_number: companyInfo?.registration_number,
				address: companyInfo?.address,
			}));
		if (roeInfo) {
			setFormData((prevData) => ({
				...prevData,
				contactName: roeInfo?.contactName || prevData.contactName,
				issuerName: roeInfo?.issuerName || prevData.issuerName,
				contactTelNumber: roeInfo?.contactTelNumber,
				contactExtNumber: roeInfo?.contactExtNumber,
				issuerTelNumber: roeInfo?.issuerTelNumber,
				issuerExtNumber: roeInfo?.issuerExtNumber,
				preferredCommunication: roeInfo?.preferredCommunication || prevData.preferredCommunication,
			}));
		}
	}, [companyInfo, roeInfo]);

	const handleConfirm = async () => {
		try {
			await PayrollService.addEmployeeROEEmploymentInfo(formData);
			handleNext(tabId);
		} catch (error) {}
	};
	const steps = [
		{
			title: "Employer Details",
			content: (
				<>
					<Stack spacing={3}>
						<HStack alignItems="baseline" justifyContent="space-between">
							<Box>
								<TextTitle title="Employer Name" />
								<NormalTextTitle title={formData?.name} />
							</Box>
							<Box>
								<TextTitle title="Employer Address" />
								<NormalTextTitle title={formData?.address?.streetNumber} />
								<NormalTextTitle title={formData?.address?.city} />
								<NormalTextTitle
									title={`${formData?.address?.state} ${formData?.address?.country}`}
								/>
								<NormalTextTitle title={formData?.address?.postalCode} />
							</Box>
							<Box>
								<TextTitle title="CRA Payroll Account Number" />
								<NormalTextTitle title={formData?.registration_number} />
							</Box>
						</HStack>

						<HStack>
							{admins && (
								<Stack>
									<TextTitle title="Contact Name" />
									<SelectFormControl
										valueParam="fullName"
										name="fullName"
										label=""
										valueText={formData.contactName || loggedInUser?.fullName}
										handleChange={(e) =>
											setFormData((prevData) => ({
												...prevData,
												contactName: e.target.value,
											}))
										}
										options={admins}
									/>
								</Stack>
							)}
							<Stack>
								<TextTitle title="Contact Telephone Number" />
								<HStack>
									<InputFormControl
										type="number"
										label=""
										name="contactTelNumber"
										placeholder="Enter Telephone Number"
										valueText={formData.contactTelNumber || ""}
										handleChange={(e) => {
											setFormData((prev) => ({
												...prev,
												contactTelNumber: e.target.value,
											}));
										}}
									/>
									<InputFormControl
										label=""
										name="contactExtNumber"
										placeholder="Enter Ext Number"
										valueText={formData.contactExtNumber || ""}
										handleChange={(e) => {
											setFormData((prev) => ({
												...prev,
												contactExtNumber: e.target.value,
											}));
										}}
									/>
								</HStack>
							</Stack>
						</HStack>
						<HStack>
							<Stack>
								<TextTitle title="Issuer Name" />
								{admins && (
									<SelectFormControl
										valueParam="fullName"
										name="fullName"
										label=""
										valueText={formData.issuerName || loggedInUser?.fullName}
										handleChange={(e) =>
											setFormData((prevData) => ({
												...prevData,
												issuerName: e.target.value,
											}))
										}
										options={admins}
									/>
								)}
							</Stack>
							<Stack>
								<TextTitle title="Issuer Telephone Number" />
								<HStack>
									<InputFormControl
										type="number"
										label=""
										name="issuerTelNumber"
										placeholder="Enter Tel Number"
										valueText={formData.issuerTelNumber || ""}
										handleChange={(e) => {
											setFormData((prev) => ({
												...prev,
												issuerTelNumber: e.target.value,
											}));
										}}
									/>
									<InputFormControl
										label=""
										name="issuerExtNumber"
										placeholder="Enter Ext Number"
										valueText={formData.issuerExtNumber || ""}
										handleChange={(e) => {
											setFormData((prev) => ({
												...prev,
												issuerExtNumber: e.target.value,
											}));
										}}
									/>
								</HStack>
							</Stack>
						</HStack>
						<RadioFormControl
							label="Preferred Communication"
							handleChange={(value) => {
								setFormData((prev) => ({
									...prev,
									preferredCommunication: value,
								}));
							}}
							defaultVal="English"
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

export default EmployerInfo;
