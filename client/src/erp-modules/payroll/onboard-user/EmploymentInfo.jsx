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
} from "@chakra-ui/react";
import TextTitle from "components/ui/text/TextTitle";
import useCostCenter from "hooks/useCostCenter";
import useDepartment from "hooks/useDepartment";
import usePaygroup from "hooks/usePaygroup";
import usePositionRoles from "hooks/usePositionRoles";
import useRoles from "hooks/useRoles";
import { COUNTRIES, employmentSubSteps, PAYROLL_STATUS } from "./userInfoDetails";

const EmploymentInfo = ({
	employmentSubStep,
	setEmploymentSubStep,
	tabPanelStyleCss,
	tabScrollCss,
	formData,
	handleChange,
	company,
	dataRefresh,
	employmentProvinces,
}) => {
	const roles = useRoles(company, dataRefresh);
	const costCentres = useCostCenter(company, dataRefresh);
	const departments = useDepartment(company, dataRefresh);
	const positionRoles = usePositionRoles(company, dataRefresh);
	const { payGroups } = usePaygroup(company, dataRefresh);

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

			<Box flex="1" overflowY="auto" css={tabScrollCss}>
				{/* Identification & Status Sub-step */}
				{employmentSubStep === 0 && (
					<Stack spacing={4} p={5}>
						<TextTitle size="xl" title="Identification & Status" />
						<FormControl>
							<FormLabel size="sm">Status</FormLabel>
							<Select
								size="sm"
								value={formData.employmentInfo.payrollStatus}
								onChange={(e) => handleChange("employmentInfo", "payrollStatus", e.target.value)}
							>
								{PAYROLL_STATUS.map((status) => (
									<option key={status.type} value={status.type}>
										{status.type}
									</option>
								))}
							</Select>
						</FormControl>

						<FormControl isRequired>
							<FormLabel size="sm">Employee Number</FormLabel>
							<Input
								size="sm"
								value={formData.employmentInfo.employeeNo}
								onChange={(e) => handleChange("employmentInfo", "employeeNo", e.target.value)}
								placeholder="Enter employee number"
							/>
						</FormControl>

						<FormControl>
							<FormLabel size="sm">System Access Level</FormLabel>
							{roles ? (
								<Select
									size="sm"
									value={formData.employmentInfo.employmentRole}
									onChange={(e) => handleChange("employmentInfo", "employmentRole", e.target.value)}
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

				{/* Position Sub-step */}
				{employmentSubStep === 1 && (
					<Stack spacing={4} p={5}>
						<TextTitle size="xl" title="Position" />

						<SimpleGrid columns={2} spacing={6}>
							<FormControl isRequired>
								<FormLabel size="sm">Role Title</FormLabel>
								{positionRoles ? (
									<Select
										size="sm"
										value={formData.employmentInfo.jobTitle}
										onChange={(e) => handleChange("employmentInfo", "jobTitle", e.target.value)}
										placeholder="Select Role title"
									>
										{positionRoles.map((role) => (
											<option key={role.name} value={role.name}>
												{role.name}
											</option>
										))}
									</Select>
								) : (
									<Flex align="center" justify="center" py={2}>
										<Spinner size="sm" mr={2} />
										<TextTitle size="sm" title="Loading job titles..." />
									</Flex>
								)}
							</FormControl>

							<FormControl>
								<FormLabel size="sm">Pay Group</FormLabel>
								{payGroups ? (
									<Select
										size="sm"
										value={formData.employmentInfo.payGroup}
										onChange={(e) => handleChange("employmentInfo", "payGroup", e.target.value)}
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

						<FormControl>
							<FormLabel size="sm">Time Management Badge ID</FormLabel>
							<Input
								size="sm"
								value={formData.employmentInfo.timeManagementBadgeID}
								onChange={(e) =>
									handleChange("employmentInfo", "timeManagementBadgeID", e.target.value)
								}
								placeholder="Enter badge ID"
							/>
						</FormControl>

						<SimpleGrid columns={2} spacing={6}>
							<FormControl isRequired>
								<FormLabel size="sm">Cost Center</FormLabel>
								{costCentres ? (
									<Select
										size="sm"
										value={formData.employmentInfo.costCenter}
										onChange={(e) => handleChange("employmentInfo", "costCenter", e.target.value)}
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
								<FormLabel size="sm">Department</FormLabel>
								{departments ? (
									<Select
										size="sm"
										value={formData.employmentInfo.department}
										onChange={(e) => handleChange("employmentInfo", "department", e.target.value)}
										placeholder="Select department"
									>
										{departments.map((dept) => (
											<option key={dept.name} value={dept.name}>
												{dept.name}
											</option>
										))}
									</Select>
								) : (
									<Flex align="center" justify="center" py={2}>
										<Spinner size="sm" mr={2} />
										<TextTitle size="sm" title="Loading departments..." />
									</Flex>
								)}
							</FormControl>

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
						</SimpleGrid>
					</Stack>
				)}

				{/* Region Sub-step */}
				{employmentSubStep === 2 && (
					<Stack spacing={4} p={5}>
						<TextTitle size="xl" title="Region" />
						<SimpleGrid columns={2} spacing={6}>
							<FormControl isRequired>
								<FormLabel size="sm">Country</FormLabel>
								<Select
									size="sm"
									value={formData.employmentInfo.employmentCountry}
									onChange={(e) =>
										handleChange("employmentInfo", "employmentCountry", e.target.value)
									}
								>
									{COUNTRIES.map((country) => (
										<option key={country.type} value={country.type}>
											{country.type}
										</option>
									))}
								</Select>
							</FormControl>

							<FormControl isRequired>
								<FormLabel size="sm">Province/State</FormLabel>
								<Select
									size="sm"
									value={formData.employmentInfo.employmentRegion}
									onChange={(e) =>
										handleChange("employmentInfo", "employmentRegion", e.target.value)
									}
								>
									{employmentProvinces.map((province) => (
										<option key={province} value={province}>
											{province}
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
