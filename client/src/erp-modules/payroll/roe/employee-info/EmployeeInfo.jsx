import {
	Alert,
	AlertDescription,
	AlertIcon,
	Button,
	HStack,
	Select,
	Stack,
	Text,
} from "@chakra-ui/react";
import RoeSection from "../RoeSection";
import { formatPayDate } from "../roeUtils";
import { PersonalInfo } from "./PersonalInfo";

// ROE-01 tab 1: choose the employee (every employee of the company, active or
// not), confirm the selection to fill in their details, then confirm them.
const EmployeeInfo = ({
	employees,
	selectedEmpId,
	setSelectedEmpId,
	confirmedEmpId,
	onConfirmSelection,
	isLoading,
	submittedROE,
	onViewSubmitted,
	onStartNew,
	formData,
	handleFieldChange,
	sections,
	toggleSection,
	done,
	onConfirmPersonal,
	errors,
}) => {
	const selectedName = employees?.find((e) => e._id === confirmedEmpId)?.fullName;
	return (
		<Stack spacing={4} p={2}>
			<RoeSection
				title="Choose Employee"
				isOpen={sections.employee}
				onToggle={() => toggleSection("employee")}
				isDone={done.employee}
				summary={selectedName}
			>
				<Stack spacing={3}>
					<HStack align="end" spacing={3}>
						<Select
							aria-label="Select employee"
							placeholder="Select employee"
							maxW="sm"
							value={selectedEmpId || ""}
							onChange={(e) => setSelectedEmpId(e.target.value)}
						>
							{(employees || []).map(({ _id, fullName }) => (
								<option key={_id} value={_id}>
									{fullName}
								</option>
							))}
						</Select>
						<Button
							bg="var(--banner_bg)"
							color="white"
							_hover={{ bg: "#4a2b4a" }}
							isDisabled={!selectedEmpId}
							isLoading={isLoading}
							onClick={onConfirmSelection}
						>
							Confirm Selection
						</Button>
					</HStack>
					{submittedROE && (
						<Alert status="info" borderRadius="md">
							<AlertIcon />
							<Stack spacing={2}>
								<AlertDescription>
									An ROE was submitted for this employee
									{submittedROE.submittedOn ? ` on ${formatPayDate(submittedROE.submittedOn)}` : ""}.
								</AlertDescription>
								<HStack>
									<Button size="sm" onClick={onViewSubmitted}>
										View / print copy
									</Button>
									<Button size="sm" variant="outline" onClick={onStartNew}>
										Start a new ROE
									</Button>
								</HStack>
							</Stack>
						</Alert>
					)}
				</Stack>
			</RoeSection>

			{done.employee && (
				<RoeSection
					title="Personal Information"
					isOpen={sections.personal}
					onToggle={() => toggleSection("personal")}
					isDone={done.personal}
					summary={[formData?.empInfo?.firstName, formData?.empInfo?.lastName].join(" ")}
				>
					<Stack spacing={3}>
						<PersonalInfo handleFieldChange={handleFieldChange} formData={formData} />
						{errors?.length > 0 && (
							<Text color="red.500" fontSize="sm">
								Required: {errors.join(", ")}
							</Text>
						)}
						<HStack justify="end">
							<Button
								bg="var(--banner_bg)"
								color="white"
								_hover={{ bg: "#4a2b4a" }}
								onClick={onConfirmPersonal}
							>
								Confirm
							</Button>
						</HStack>
					</Stack>
				</RoeSection>
			)}
		</Stack>
	);
};

export default EmployeeInfo;
