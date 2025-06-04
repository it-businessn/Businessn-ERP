import {
	Box,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Select,
	Stack,
	Step,
	StepDescription,
	StepIcon,
	StepIndicator,
	StepNumber,
	Stepper,
	StepSeparator,
	StepStatus,
	StepTitle,
	useToast,
} from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import TextTitle from "components/ui/text/TextTitle";
import {
	payInfoSubSteps,
	tabPanelStyleCss,
	tabScrollCss,
	userInfoDetails,
} from "erp-modules/payroll/onboard-user/customInfo";
import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";

const PayInfo = ({ company, userId }) => {
	const toast = useToast();
	const [payInfo, setPayInfo] = useState(null);
	const [moreDetails, setMoreDetails] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState(userInfoDetails);

	useEffect(() => {
		const fetchEmployeePayInfo = async () => {
			try {
				const { data } = await PayrollService.getEmployeePayInfo(company, userId);
				setPayInfo(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchEmployeePayInfo();
	}, [company, userId]);

	useEffect(() => {
		if (payInfo) {
			const { roles, empId, _id } = payInfo;

			setFormData({
				payInfo: {
					payFrequency: roles[0]?.payFrequency,
					salary: roles[0]?.payRate,
					payType: roles[0]?.typeOfEarning,
					partTimeStandardHours: roles[0]?.partTimeStandardHours,
					fullTimeStandardHours: roles[0]?.fullTimeStandardHours,
				},
			});
			setMoreDetails({ empId, _id });
		}
	}, [payInfo]);

	const handleChange = (section, field, value) => {
		setFormData({
			...formData,
			[section]: {
				...formData[section],
				[field]: value,
			},
		});
	};

	const handleSave = async () => {
		setIsLoading(true);
		try {
			const {
				salary,
				payType,
				payFrequency,
				taxWithholding,
				fullTimeStandardHours,
				partTimeStandardHours,
			} = formData.payInfo;

			const payInfoData = {
				empId: moreDetails.empId,
				companyName: company,
				salary,
				payType,
				payFrequency,
				taxWithholding,
				fullTimeStandardHours,
				partTimeStandardHours,
			};
			const { data } = await PayrollService.updateEmployeePayInfo(payInfoData, moreDetails?._id);
			setIsLoading(false);
			toast({
				title: "Payment info updated successfully.",
				status: "success",
				duration: 1000,
				isClosable: true,
			});
		} catch (error) {}
	};

	return (
		<Flex height="100%">
			<Box
				p={6}
				width="280px"
				borderRight="1px solid"
				borderColor="gray.200"
				flexShrink={0}
				bg="gray.50"
			>
				<Stepper index={0} orientation="vertical" gap={8} sx={tabPanelStyleCss}>
					{payInfoSubSteps.map((step, index) => (
						<Step key={index} cursor="pointer" py={2}>
							<StepIndicator>
								<StepStatus
									complete={<StepIcon fontSize="1.2em" color="white" bg={"var(--banner_bg)"} />}
									incomplete={<StepNumber fontSize="1.1em" color={"var(--banner_bg)"} />}
									active={<StepNumber fontSize="1.1em" color="white" bg={"var(--banner_bg)"} />}
								/>
							</StepIndicator>
							<Box flexShrink="0" ml={3}>
								<StepTitle fontWeight={"bold"} mb={1}>
									{step.title}
								</StepTitle>
								<StepDescription fontSize="sm" color="gray.600">
									{step.description}
								</StepDescription>
							</Box>
							<StepSeparator />
						</Step>
					))}
				</Stepper>
			</Box>
			<Box flex={0.7} overflowY="auto" css={tabScrollCss}>
				<Stack spacing={4} p={5}>
					<TextTitle size="xl" title="Compensation Information" />
					<Flex gap={4}>
						<FormControl isRequired>
							<FormLabel size="sm">Pay Rate</FormLabel>
							<Input
								size="sm"
								type="number"
								value={formData.payInfo.salary || ""}
								onChange={(e) => handleChange("payInfo", "salary", e.target.value)}
								placeholder="Pay Rate"
							/>
						</FormControl>

						<FormControl isRequired>
							<FormLabel size="sm">Pay Type</FormLabel>
							<Select
								size="sm"
								value={formData.payInfo.payType || ""}
								onChange={(e) => handleChange("payInfo", "payType", e.target.value)}
							>
								<option value="Hourly">Hourly</option>
								<option value="FTsalary">Full Time Salaried</option>
								<option value="PTsalary">Part Time Salaried</option>
								{/* <option value="commission">Commission</option> */}
							</Select>
						</FormControl>
					</Flex>

					<Flex gap={4}>
						{formData.payInfo.payType === "FTsalary" ? (
							<FormControl>
								<FormLabel size="sm">Standard Hours (FT)</FormLabel>
								<Input
									size="sm"
									type="number"
									value={formData.payInfo.fullTimeStandardHours || ""}
									onChange={(e) => handleChange("payInfo", "fullTimeStandardHours", e.target.value)}
									placeholder="Enter Full Time Hours"
								/>
							</FormControl>
						) : formData.payInfo.payType === "PTsalary" ? (
							<FormControl>
								<FormLabel size="sm">Standard Hours (PT)</FormLabel>
								<Input
									type="number"
									size="sm"
									value={formData.payInfo.partTimeStandardHours || ""}
									onChange={(e) => handleChange("payInfo", "partTimeStandardHours", e.target.value)}
									placeholder="Enter Part Time Hours"
								/>
							</FormControl>
						) : (
							<></>
						)}
						{/* <FormControl isRequired>
						<FormLabel size="sm">Pay Frequency</FormLabel>
						<Select
							size="sm"
							value={formData.payInfo.payFrequency}
							onChange={(e) => handleChange("payInfo", "payFrequency", e.target.value)}
						>
							<option value="weekly">Weekly</option>
							<option value="biweekly">Bi-weekly</option>
							<option value="monthly">Monthly</option>
						</Select>
					</FormControl> */}

						{/* <FormControl>
						<FormLabel size="sm">Tax Withholding</FormLabel>
						<Input
							size="sm"
							value={formData.payInfo.taxWithholding}
							onChange={(e) => handleChange("payInfo", "taxWithholding", e.target.value)}
							placeholder="Tax Withholding"
						/>
					</FormControl> */}
					</Flex>
				</Stack>
				<PrimaryButton
					bg="var(--banner_bg)"
					size="sm"
					onOpen={handleSave}
					ml={5}
					mt={4}
					borderRadius={6}
					name="Save"
					isLoading={isLoading}
				/>
			</Box>
		</Flex>
	);
};
export default PayInfo;
