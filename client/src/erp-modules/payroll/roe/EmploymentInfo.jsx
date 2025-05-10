import { FormLabel, HStack, SimpleGrid, Stack, useToast } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import DateTimeFormControl from "components/ui/form/DateTimeFormControl";
import SelectFormControl from "components/ui/form/SelectFormControl";
import NormalTextTitle from "components/ui/NormalTextTitle";
import TextTitle from "components/ui/text/TextTitle";
import VerticalStepper from "components/ui/VerticalStepper";
import { COMPANIES, REASON_CODE, RECALL_OPTIONS } from "constant";
import useEmployeeEmploymentInfo from "hooks/useEmployeeEmploymentInfo";
import usePaygroup from "hooks/usePaygroup";
import moment from "moment";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import { getAmount } from "utils/convertAmt";
import { getDefaultDate } from "utils/convertDate";
import StepContent from "../employees/pageview/step-content";

const EmploymentInfo = ({ company, handleNext, tabId }) => {
	const initialFormData = {
		empId: roeEmpId,
		employmentStartDate: "",
		employmentLeaveDate: new Date(),
		finalPayPeriodEndDate: "",
		recallDate: "",
		expectedRecallDate: "",
		reasonCode: "",
		positions: [],
		companyName: company,
	};
	const roeEmpId = LocalStorageService.getItem("roeEmpId");
	const toast = useToast();
	const [selectedPayGroupOption, setSelectedPayGroupOption] = useState(
		company === COMPANIES.BUSINESSN_ORG ? "Monthly" : null,
	);
	const { payGroupSchedule } = usePaygroup(company, selectedPayGroupOption, true);
	const [roeInfo, setRoeInfo] = useState(null);
	const [formData, setFormData] = useState(initialFormData);
	const employmentInfo = useEmployeeEmploymentInfo(company, roeEmpId);

	useEffect(() => {
		const fetchEmployeeROEEmploymentInfo = async () => {
			try {
				const { data } = await PayrollService.getEmployeeROEEmploymentInfo(company, roeEmpId);
				setRoeInfo(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchEmployeeROEEmploymentInfo();
	}, [company]);

	useEffect(() => {
		if (employmentInfo) {
			setFormData((prevData) => ({
				...prevData,
				positions: employmentInfo?.positions,
				employmentStartDate: employmentInfo?.employmentStartDate,
				employmentLeaveDate: employmentInfo?.employmentLeaveDate,
			}));
		}
		if (roeInfo) {
			setFormData(roeInfo);
		}
	}, [employmentInfo, roeInfo]);

	useEffect(() => {
		const finalPayPeriodRecord = payGroupSchedule?.find(
			({ payPeriodStartDate, payPeriodEndDate }) =>
				moment(formData?.employmentLeaveDate).isBetween(
					payPeriodStartDate,
					payPeriodEndDate,
					null,
					"[]",
				),
		);
		setFormData((prevData) => ({
			...prevData,
			finalPayPeriodEndDate: finalPayPeriodRecord?.payPeriodEndDate,
		}));
	}, [formData?.employmentLeaveDate]);

	const handleEmpROEInfo = async () => {
		try {
			if (!formData?.expectedRecallDate) {
				formData.expectedRecallDate = "Unknown";
			}
			await PayrollService.addEmployeeROEEmploymentInfo(formData);
			handleNext(tabId);
			toast({
				title: "Employment info updated successfully.",
				status: "success",
				duration: 1000,
				isClosable: true,
			});
		} catch (error) {}
	};

	const steps = [
		{
			title: "Tenure",
			content: (
				<>
					<Stack spacing={3}>
						<HStack alignItems="baseline" spacing={5}>
							<Stack w="50%">
								<TextTitle title="Tenure" />
								<HStack>
									<DateTimeFormControl
										label="Start Date"
										valueText1={getDefaultDate(formData?.employmentStartDate)}
										name1="employmentStartDate"
										handleChange={(e) => {
											setFormData((prev) => ({
												...prev,
												employmentStartDate: e.target.value,
											}));
										}}
									/>
									<DateTimeFormControl
										required
										label="Last Day Worked"
										valueText1={
											formData?.employmentLeaveDate
												? getDefaultDate(formData?.employmentLeaveDate)
												: ""
										}
										name1="employmentLeaveDate"
										handleChange={(e) => {
											setFormData((prev) => ({
												...prev,
												employmentLeaveDate: e.target.value,
											}));
										}}
									/>
								</HStack>
							</Stack>
							<Stack>
								<TextTitle title="Occupation" />
								{formData?.positions?.map((position, index) => (
									<Stack key={`${position?.title}_${index}`} spacing={2}>
										<HStack>
											<FormLabel w="100%">
												Position:
												<NormalTextTitle title={position?.title || ""} />
											</FormLabel>
											<FormLabel w="100%">
												Payrate:
												<NormalTextTitle title={getAmount(position?.payRate) || ""} />
											</FormLabel>
										</HStack>

										<FormLabel>
											Linked Time Management Badge ID:
											<NormalTextTitle title={position?.timeManagementBadgeID || "NA"} />
										</FormLabel>
									</Stack>
								))}
							</Stack>
						</HStack>

						<HStack w="50%">
							<DateTimeFormControl
								label="Final Pay Period End Date"
								valueText1={
									formData?.finalPayPeriodEndDate
										? getDefaultDate(formData?.finalPayPeriodEndDate)
										: ""
								}
								name1="finalPayPeriodEndDate"
								handleChange={(e) => {
									setFormData((prev) => ({
										...prev,
										finalPayPeriodEndDate: e.target.value,
									}));
								}}
							/>
							<SelectFormControl
								valueParam="name"
								name="expectedRecallDate"
								label="Expected Date of Recall"
								valueText={formData?.expectedRecallDate || RECALL_OPTIONS[0]?.name}
								handleChange={(e) =>
									setFormData((prevData) => ({
										...prevData,
										expectedRecallDate: e.target.value,
									}))
								}
								options={RECALL_OPTIONS}
							/>
							{formData?.expectedRecallDate === "Return Date" && (
								<DateTimeFormControl
									required
									label="Recall Date"
									valueText1={formData?.recallDate ? getDefaultDate(formData?.recallDate) : ""}
									name1="recallDate"
									handleChange={(e) => {
										setFormData((prev) => ({
											...prev,
											recallDate: e.target.value,
										}));
									}}
								/>
							)}
						</HStack>
						<SelectFormControl
							w="50%"
							valueParam="name"
							name="reasonCode"
							label="Reason Code"
							placeholder="Select reason"
							valueText={formData?.reasonCode || ""}
							handleChange={(e) =>
								setFormData((prevData) => ({
									...prevData,
									reasonCode: e.target.value,
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
						onOpen={handleEmpROEInfo}
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
