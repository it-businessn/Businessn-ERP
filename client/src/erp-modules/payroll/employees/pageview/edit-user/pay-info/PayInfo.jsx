import {
	Box,
	Flex,
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
import TextTitle from "components/ui/text/TextTitle";
import {
	EARNING_TYPE,
	payInfoSubSteps,
	tabPanelStyleCss,
	tabScrollCss,
} from "erp-modules/payroll/onboard-user/customInfo";
import React, { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";
import EarningInfo from "./EarningInfo";

const PayInfo = ({ company, userId }) => {
	const toast = useToast();
	const [payInfo, setPayInfo] = useState(null);
	const [moreDetails, setMoreDetails] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		payInfo: {
			salary: "",
			payType: EARNING_TYPE.HOURLY,
			payFrequency: "biweekly",
			taxWithholding: "",
			fullTimeStandardHours: 80,
			partTimeStandardHours: 40,
			roles: [],
		},
	});
	const [editedIndices, setEditedIndices] = useState({});

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
					roles,
				},
			});
			setMoreDetails({ empId, _id });
		}
	}, [payInfo]);

	const handleUpdate = (role, updateRecordIndex) => {
		if (role) {
			const existingPositions = formData?.payInfo?.roles;
			const positionIndex =
				updateRecordIndex > -1
					? updateRecordIndex
					: formData?.payInfo.roles?.findIndex(({ title }) => title === role?.title);

			if (positionIndex === -1) {
				existingPositions.push(role);
				setFormData({
					...formData,
					payInfo: {
						...formData.payInfo,
						roles: existingPositions,
					},
				});
			} else {
				formData.payInfo.roles[positionIndex] = role;
			}
			setEditedIndices((prev) => ({ ...prev, [positionIndex]: false }));
		}
		handleSave();
	};

	const handleSave = async () => {
		setIsLoading(true);
		try {
			const { roles } = formData.payInfo;

			const payInfoData = {
				empId: moreDetails?.empId || userId,
				companyName: company,
				roles,
			};
			if (moreDetails?._id) {
				await PayrollService.updateEmployeePayInfo(payInfoData, moreDetails?._id);
			} else {
				await PayrollService.addEmployeePayInfo(payInfoData);
			}
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
			<Box maxH={"calc(100vh - 300px)"} flex={1} overflowY="auto" css={tabScrollCss}>
				<Stack spacing={3} p={5}>
					<TextTitle size="xl" title="Compensation Information" />
					{formData.payInfo.roles?.map((role, index) => (
						<React.Fragment key={`${role?.title}_${index}`}>
							{formData.payInfo.roles?.length > 1 && <TextTitle title={role.title} />}
							<EarningInfo
								role={role}
								handleUpdate={handleUpdate}
								updateRecordIndex={index}
								setEditedIndices={setEditedIndices}
								editedIndices={editedIndices}
							/>
						</React.Fragment>
					))}
				</Stack>
			</Box>
		</Flex>
	);
};
export default PayInfo;
