import {
	Box,
	Checkbox,
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
} from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import useCostCenter from "hooks/useCostCenter";
import usePaygroup from "hooks/usePaygroup";
import useRoles from "hooks/useRoles";
import { useEffect, useState } from "react";
import { EmployeeNumberControl } from "../controls/EmployeeNumberControl";
import { RoleInfoControl } from "../controls/RoleInfoControl";
import {
	COUNTRIES,
	employmentSubSteps,
	PAYROLL_STATUS,
	tabPanelStyleCss,
	tabScrollCss,
} from "./customInfo";

const EmploymentInfo = ({
	employmentSubStep,
	setEmploymentSubStep,
	formData,
	handleChange,
	company,
	employmentProvinces,
	lastBadgeId,
}) => {
	const roles = useRoles(company);
	const costCentres = useCostCenter(company);
	const { payGroups } = usePaygroup(company, false);

	const [autoGenerate, setAutoGenerate] = useState(false);
	const [filteredDept, setFilteredDept] = useState(null);

	useEffect(() => {
		if (payGroups?.length) {
			handleChange("employmentInfo", "payGroup", payGroups[0].name);
		}
	}, [payGroups]);

	useEffect(() => {
		if (autoGenerate) {
			const newID = String(lastBadgeId + 1).padStart(4, "0");
			handleChange("employmentInfo", "timeManagementBadgeID", newID);
		}
	}, [autoGenerate, lastBadgeId]);

	useEffect(() => {
		if (formData.employmentInfo.costCenter) {
			const selectedDepts = costCentres?.find((_) =>
				_.name.includes(formData.employmentInfo.costCenter),
			)?.departments;
			setFilteredDept(selectedDepts);
		}
	}, [formData.employmentInfo.costCenter]);
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

			<Box flex={1} overflowY="auto" css={tabScrollCss}>
				{/* Identification & Status Sub-step */}
				{employmentSubStep === 0 && (
					<Stack spacing={4} p={5}>
						<TextTitle size="xl" title="Identification & Status" />
						<FormControl>
							<FormLabel size="sm">Status</FormLabel>
							<Select
								size="sm"
								value={formData.employmentInfo.payrollStatus}
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
									value={formData.employmentInfo.employmentRole}
									onChange={(e) => {
										if (e.target.value) {
											handleChange("employmentInfo", "employmentRole", e.target.value);
										}
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
						<FormControl isRequired>
							<FormLabel size="sm">Start Date</FormLabel>
							<Input
								size="sm"
								type="date"
								value={formData.employmentInfo.employmentStartDate}
								onChange={(e) =>
									handleChange("employmentInfo", "employmentStartDate", e.target.value)
								}
							/>
						</FormControl>
					</Stack>
				)}

				{/* Position Sub-step */}
				{employmentSubStep === 2 && (
					<Stack spacing={4} p={5}>
						<TextTitle size="xl" title="Position" />

						<SimpleGrid columns={2} spacing={6}>
							<RoleInfoControl
								company={company}
								title={formData.employmentInfo.jobTitle}
								handleChange={(e) => {
									if (e.target.value) {
										handleChange("employmentInfo", "jobTitle", e.target.value);
									}
								}}
							/>

							<FormControl>
								<FormLabel size="sm">Pay Group</FormLabel>
								{payGroups ? (
									<Select
										size="sm"
										value={formData.employmentInfo.payGroup}
										onChange={(e) => {
											if (e.target.value) {
												handleChange("employmentInfo", "payGroup", e.target.value);
											}
										}}
										placeholder="Select pay group"
									>
										{payGroups.map((group) => (
											<option key={group.name} value={group.name}>
												{group.name}
											</option>
										))}
									</Select>
								) : (
									<Flex align="center" justify="center" py={2}>
										<Spinner size="sm" mr={2} />
										<TextTitle size="sm" title="Loading pay groups..." />
									</Flex>
								)}
							</FormControl>
						</SimpleGrid>

						<SimpleGrid columns={2} spacing={6}>
							<FormControl>
								<FormLabel size="sm">Time Management Badge ID</FormLabel>
								<Input
									size="sm"
									value={formData.employmentInfo.timeManagementBadgeID}
									onChange={(e) =>
										handleChange("employmentInfo", "timeManagementBadgeID", e.target.value)
									}
									placeholder="Enter badge ID"
									isDisabled={autoGenerate}
									mb={1}
								/>
								<Checkbox
									isChecked={autoGenerate}
									colorScheme="facebook"
									onChange={(e) => setAutoGenerate(e.target.checked)}
								>
									Auto-generate Badge ID
								</Checkbox>
							</FormControl>
							<FormControl>
								<FormLabel size="sm">Employee Card Number</FormLabel>
								<Input
									size="sm"
									value={formData.employmentInfo.employeeCardNumber}
									onChange={(e) =>
										handleChange("employmentInfo", "employeeCardNumber", e.target.value)
									}
									placeholder="Enter card number"
								/>
							</FormControl>
						</SimpleGrid>

						<SimpleGrid columns={2} spacing={6}>
							<FormControl isRequired>
								<FormLabel size="sm">Cost Center</FormLabel>
								{costCentres ? (
									<Select
										size="sm"
										value={formData.employmentInfo.costCenter}
										onChange={(e) => {
											if (e.target.value) {
												handleChange("employmentInfo", "costCenter", e.target.value);
											}
										}}
										placeholder="Select cost center"
									>
										{costCentres.map((center) => (
											<option key={center.name} value={center.name}>
												{center.name}
											</option>
										))}
									</Select>
								) : (
									<Flex align="center" justify="center" py={2}>
										<Spinner size="sm" mr={2} />
										<TextTitle size="sm" title="Loading cost centers..." />
									</Flex>
								)}
							</FormControl>
							<FormControl isRequired>
								<FormLabel size="sm">Department</FormLabel>
								<Select
									size="sm"
									disabled={filteredDept ? false : true}
									value={formData.employmentInfo.department}
									onChange={(e) => {
										if (e.target.value) {
											handleChange("employmentInfo", "department", e.target.value);
										}
									}}
									placeholder="Select department"
								>
									{filteredDept?.map((dept) => (
										<option key={dept.name} value={dept.name}>
											{dept.name}
										</option>
									))}
								</Select>
							</FormControl>
						</SimpleGrid>
					</Stack>
				)}

				{/* Region Sub-step */}
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
									placeholder="Select Region"
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
			</Box>
		</Flex>
	);
};
export default EmploymentInfo;
