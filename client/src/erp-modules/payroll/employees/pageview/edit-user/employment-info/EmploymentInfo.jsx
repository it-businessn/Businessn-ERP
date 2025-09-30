import {
	Box,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Select,
	SimpleGrid,
	Spinner,
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
	VStack,
} from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import useCostCenter from "hooks/useCostCenter";
import useRoles from "hooks/useRoles";

import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import { EmployeeNumberControl } from "erp-modules/payroll/controls/EmployeeNumberControl";
import {
	COUNTRIES,
	employmentSubSteps,
	PAYROLL_STATUS,
	tabPanelStyleCss,
	tabScrollCss,
} from "erp-modules/payroll/onboard-user/customInfo";
import { useEffect, useState } from "react";
import PayrollService from "services/PayrollService";
import { getDefaultDate } from "utils/convertDate";
import NewPositionModal from "./NewPositionModal";
import PositionInfo from "./PositionInfo";

const EmploymentInfo = ({ company, userId, payGroups, selectedPayGroupOption, lastBadgeId }) => {
	const toast = useToast();
	const roles = useRoles(company);
	const costCentres = useCostCenter(company);
	const [isLoading, setIsLoading] = useState(false);
	const [moreDetails, setMoreDetails] = useState(null);
	const [employmentSubStep, setEmploymentSubStep] = useState(0);
	const [employmentProvinces, setEmploymentProvinces] = useState([]);
	const [employmentInfo, setEmploymentInfo] = useState(null);
	const [formData, setFormData] = useState({
		employmentInfo: {
			payrollStatus: "Payroll Active",
			employeeNo: "",
			employmentRole: "Employee",
			jobTitle: "",
			payGroup: "",
			timeManagementBadgeID: "",
			costCenter: "",
			employeeCardNumber: "",
			department: "",
			employmentStartDate: "",
			employmentLeaveDate: "",
			employmentCountry: "Canada",
			employmentRegion: "British Columbia",
			branch: "",
			branchAddress: "",
			branchCity: "",
			branchZipCode: "",
			positions: [],
		},
	});
	const [showModal, setShowModal] = useState(false);
	const [editedIndices, setEditedIndices] = useState({});

	useEffect(() => {
		setEditedIndices({});
	}, [employmentSubStep]);

	useEffect(() => {
		const fetchEmployeeEmploymentInfo = async () => {
			try {
				const { data } = await PayrollService.getEmployeeEmploymentInfo(company, userId);
				setEmploymentInfo(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchEmployeeEmploymentInfo();
	}, [company, userId]);

	useEffect(() => {
		if (employmentInfo) {
			const {
				payrollStatus,
				employeeNo,
				employmentRole,
				employmentStartDate,
				employmentLeaveDate,
				employmentCountry,
				employmentRegion,
				positions,
				empId,
				_id,
			} = employmentInfo;

			setFormData({
				employmentInfo: {
					payrollStatus,
					employeeNo,
					employmentRole,
					employmentStartDate,
					employmentLeaveDate,
					employmentCountry,
					employmentRegion,
					positions,
				},
			});
			setMoreDetails({ empId, _id });
		}
	}, [employmentInfo]);

	useEffect(() => {
		const selectedCountry = COUNTRIES.find(
			({ code }) => code === formData.employmentInfo.employmentCountry,
		);
		if (selectedCountry) {
			setEmploymentProvinces(selectedCountry.provinces);
		}
	}, [formData.employmentInfo.employmentCountry]);

	const handleChange = (section, field, value) => {
		setFormData({
			...formData,
			[section]: {
				...formData[section],
				[field]: value,
			},
		});
	};

	const handleUpdate = (position, updateRecordIndex) => {
		if (position) {
			const existingPositions = formData?.employmentInfo.positions;
			const positionIndex =
				updateRecordIndex > -1
					? updateRecordIndex
					: formData?.employmentInfo.positions?.findIndex(({ title }) => title === position?.title);

			if (positionIndex === -1) {
				existingPositions.push(position);
				setFormData({
					...formData,
					employmentInfo: {
						...formData.employmentInfo,
						positions: existingPositions,
					},
				});
			} else {
				formData.employmentInfo.positions[positionIndex] = position;
			}
			setEditedIndices((prev) => ({ ...prev, [positionIndex]: false }));
		}
		handleSave();
	};

	const handleSave = async () => {
		setIsLoading(true);
		try {
			const {
				payrollStatus,
				employeeNo,
				employmentRole,
				employmentStartDate,
				employmentLeaveDate,
				employmentCountry,
				employmentRegion,
				positions,
			} = formData.employmentInfo;

			const employmentInfoData = {
				empId: moreDetails?.empId || userId,
				companyName: company,
				payrollStatus,
				employeeNo,
				employmentRole,
				employmentStartDate,
				employmentLeaveDate,
				employmentCountry,
				employmentRegion,
				positions,
			};
			const { data } = moreDetails?._id
				? await PayrollService.updateEmployeeEmploymentInfo(employmentInfoData, moreDetails?._id)
				: await PayrollService.addEmployeeEmploymentInfo(employmentInfoData);
			setShowModal(false);
			setIsLoading(false);
			toast({
				title: "Employment info updated successfully.",
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
				<Stepper index={employmentSubStep} orientation="vertical" gap={8} sx={tabPanelStyleCss}>
					{employmentSubSteps.map((step, index) => (
						<Step key={index} onClick={() => setEmploymentSubStep(index)} cursor="pointer" py={2}>
							<StepIndicator>
								<StepStatus
									complete={<StepIcon fontSize="1.2em" color="white" bg={"var(--banner_bg)"} />}
									incomplete={<StepNumber fontSize="1.1em" color={"var(--banner_bg)"} />}
									active={<StepNumber fontSize="1.1em" color="white" bg={"var(--banner_bg)"} />}
								/>
							</StepIndicator>
							<Box flexShrink="0" ml={3}>
								<StepTitle fontWeight={employmentSubStep === index ? "bold" : "normal"} mb={1}>
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

			<Box flex={1} css={tabScrollCss}>
				{/* Identification & Status Sub-step */}
				{employmentSubStep === 0 && (
					<Stack spacing={4} p={5}>
						<TextTitle size="xl" title="Identification & Status" />
						<FormControl>
							<FormLabel size="sm">Status</FormLabel>
							<Select
								size="sm"
								value={formData.employmentInfo.payrollStatus || ""}
								onChange={(e) => {
									if (e.target.value)
										handleChange("employmentInfo", "payrollStatus", e.target.value);
								}}
							>
								{PAYROLL_STATUS.map((status) => (
									<option key={status.type} value={status.type}>
										{status.type}
									</option>
								))}
							</Select>
						</FormControl>

						<EmployeeNumberControl
							company={company}
							formData={formData}
							handleChange={handleChange}
						/>

						<FormControl>
							<FormLabel size="sm">System Access Level</FormLabel>
							{roles ? (
								<Select
									size="sm"
									value={formData.employmentInfo.employmentRole || ""}
									onChange={(e) => {
										if (e.target.value)
											handleChange("employmentInfo", "employmentRole", e.target.value);
									}}
								>
									{roles.map((role) => (
										<option key={role.name} value={role.name}>
											{role.name}
										</option>
									))}
								</Select>
							) : (
								<Flex align="center" justify="center" py={2}>
									<Spinner size="sm" mr={2} />
									<TextTitle size="sm" title="Loading access levels..." />
								</Flex>
							)}
						</FormControl>
					</Stack>
				)}

				{employmentSubStep === 1 && (
					<Stack spacing={4} p={5}>
						<TextTitle size="xl" title="Tenure" />
						<SimpleGrid columns={2} spacing={6}>
							<FormControl isRequired>
								<FormLabel size="sm">Start Date</FormLabel>
								<Input
									size="sm"
									type="date"
									value={
										formData.employmentInfo.employmentStartDate
											? getDefaultDate(formData.employmentInfo.employmentStartDate)
											: ""
									}
									onChange={(e) =>
										handleChange("employmentInfo", "employmentStartDate", e.target.value)
									}
								/>
							</FormControl>
							<FormControl>
								<FormLabel size="sm">Leave Date</FormLabel>
								<Input
									size="sm"
									type="date"
									value={
										formData.employmentInfo.employmentLeaveDate
											? getDefaultDate(formData.employmentInfo.employmentLeaveDate)
											: ""
									}
									onChange={(e) =>
										handleChange("employmentInfo", "employmentLeaveDate", e.target.value)
									}
								/>
							</FormControl>
						</SimpleGrid>
					</Stack>
				)}

				{employmentSubStep === 2 && (
					<>
						{showModal ? (
							<NewPositionModal
								lastBadgeId={lastBadgeId}
								company={company}
								onClose={() => setShowModal(false)}
								selectedPayGroup={selectedPayGroupOption}
								costCentres={costCentres}
								payGroups={payGroups}
								handleUpdate={handleUpdate}
							/>
						) : (
							<VStack p={5} w={"100%"} spacing={3} alignItems="end">
								<PrimaryButton
									bg="var(--banner_bg)"
									size="sm"
									borderRadius={6}
									name="Add New Position"
									isLoading={isLoading}
									onOpen={() => setShowModal(true)}
								/>
								<Box maxH={"calc(100vh - 365px)"} w={"100%"} overflowY="auto" css={tabScrollCss}>
									{formData.employmentInfo.positions?.map((position, index) => (
										<BoxCard
											p={2}
											key={`${position?.title}_${index}`}
											border="1px solid var(--lead_cards_border)"
										>
											<TextTitle title={position.title} />
											<PositionInfo
												company={company}
												updateRecordIndex={index}
												position={position}
												costCentres={costCentres}
												payGroups={payGroups}
												handleUpdate={handleUpdate}
												editedIndices={editedIndices}
												setEditedIndices={setEditedIndices}
												lastBadgeId={lastBadgeId}
											/>
										</BoxCard>
									))}
								</Box>
							</VStack>
						)}
					</>
				)}

				{employmentSubStep === 3 && (
					<Stack spacing={4} p={5}>
						<TextTitle size="xl" title="Region" />
						<SimpleGrid columns={2} spacing={6}>
							<FormControl isRequired>
								<FormLabel size="sm">Country</FormLabel>
								<Select
									size="sm"
									value={formData.employmentInfo.employmentCountry || ""}
									onChange={(e) => {
										if (e.target.value) {
											handleChange("employmentInfo", "employmentCountry", e.target.value);
										}
									}}
									placeholder="Select Country"
								>
									{COUNTRIES.map(({ type, code }) => (
										<option key={type} value={code}>
											{type}
										</option>
									))}
								</Select>
							</FormControl>

							<FormControl isRequired>
								<FormLabel size="sm">Province/State</FormLabel>
								<Select
									size="sm"
									value={formData.employmentInfo.employmentRegion || ""}
									onChange={(e) => {
										if (e.target.value) {
											handleChange("employmentInfo", "employmentRegion", e.target.value);
										}
									}}
									placeholder="Select Province"
								>
									{employmentProvinces.map(({ name, id }) => (
										<option key={name} value={id}>
											{name}
										</option>
									))}
								</Select>
							</FormControl>
						</SimpleGrid>
					</Stack>
				)}
				{employmentSubStep !== 2 && (
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
				)}
			</Box>
		</Flex>
	);
};
export default EmploymentInfo;
