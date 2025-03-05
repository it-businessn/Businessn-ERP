import { SimpleGrid, useToast } from "@chakra-ui/react";
import PrimaryButton from "components/ui/button/PrimaryButton";
import BoxCard from "components/ui/card";
import TextTitle from "components/ui/text/TextTitle";
import VerticalStepper from "components/ui/VerticalStepper";
import {
	EMP_IDENTIFICATION_STATUS_CONFIG,
	EMP_REGION_CONFIG,
	EMP_TENURE_CONFIG,
	getInitialCorporateInfo,
} from "config/payroll/employees/employmentInfo";
import useCostCenter from "hooks/useCostCenter";
import useDepartment from "hooks/useDepartment";
import useEmployeeEmploymentInfo from "hooks/useEmployeeEmploymentInfo";
import usePaygroup from "hooks/usePaygroup";
import useRoles from "hooks/useRoles";
import useSelectedEmp from "hooks/useSelectedEmp";
import { useEffect, useState } from "react";
import LocalStorageService from "services/LocalStorageService";
import PayrollService from "services/PayrollService";
import StepContent from "../step-content";
import Record from "../step-content/Record";
import PositionInfo from "./PositionInfo";

const CorporateInfo = ({ company, isOnboarding, id, handleNext, handlePrev }) => {
	const toast = useToast();
	const { empId } = useSelectedEmp(LocalStorageService.getItem("empId"));
	const [refresh, setRefresh] = useState(false);
	const employmentInfo = useEmployeeEmploymentInfo(
		company,
		empId,
		true,
		false,
		refresh,
		isOnboarding,
	);
	const onboardingEmpId = LocalStorageService.getItem("onboardingEmpId");
	const initialCorporateInfo = getInitialCorporateInfo(onboardingEmpId ?? empId, company);
	const [formData, setFormData] = useState(initialCorporateInfo);
	const [isOpen, setIsOpen] = useState(false);
	const [isDisabled, setIsDisabled] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const { payGroups } = usePaygroup(company, false);
	const department = useDepartment(company);
	const costCentres = useCostCenter(company);
	const roles = useRoles(company);

	useEffect(() => {
		if (employmentInfo) {
			setFormData(employmentInfo);
		} else {
			setFormData(initialCorporateInfo);
		}
	}, [employmentInfo?._id, empId]);

	useEffect(() => {
		if (formData.employeeNo) {
			setIsDisabled(false);
		} else {
			setIsDisabled(true);
		}
	}, [formData.employeeNo]);

	const handleSubmit = async (position) => {
		setIsLoading(true);
		try {
			if (position) {
				const existingPositions = formData.positions;
				const positionIndex = formData.positions?.findIndex(
					({ title }) => title === position.title,
				);
				if (positionIndex === -1) {
					existingPositions.push(position);
					formData.positions = existingPositions;
				} else {
					formData.positions[positionIndex] = position;
				}
			}
			await PayrollService.addEmployeeEmploymentInfo(formData);
			setIsLoading(false);
			setIsDisabled(true);
			setRefresh((prev) => !prev);
			setIsOpen(false);
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
			title: "Identification and Status",
			content: (
				<Record
					handleConfirm={() => ""}
					formData={formData}
					setFormData={setFormData}
					title="Identification and Status"
					config={EMP_IDENTIFICATION_STATUS_CONFIG(roles)}
					isLoading={isLoading}
					handleSubmit={handleSubmit}
					isDisabled={isDisabled}
				/>
			),
		},
		{
			title: "Tenure",
			content: (
				<Record
					isOnboarding={isOnboarding}
					handleConfirm={() => ""}
					formData={formData}
					setFormData={setFormData}
					title="Tenure"
					config={EMP_TENURE_CONFIG}
					isLoading={isLoading}
					handleSubmit={handleSubmit}
				/>
			),
		},
		{
			title: "Positions",
			content: (
				<>
					<TextTitle title="Positions" />
					{isOpen ? (
						<PositionInfo
							isOpen={isOpen}
							setIsOpen={setIsOpen}
							isDisabled={isDisabled}
							setIsDisabled={setIsDisabled}
							payGroups={payGroups}
							department={department}
							costCentres={costCentres}
							handleSubmit={handleSubmit}
						/>
					) : (
						<>
							<PrimaryButton
								my={3}
								size="xs"
								name="Add Role"
								isLoading={isLoading}
								loadingText="Loading"
								onOpen={() => setIsOpen(true)}
							/>
							{formData.positions?.map((position, index) => (
								<BoxCard mt={2} border="1px solid var(--lead_cards_border)" key={position?.title}>
									<PositionInfo
										rolePos={`Position ${index + 1}`}
										currentRoleInfo={position}
										isOpen={isOpen}
										setIsOpen={setIsOpen}
										isDisabled={isDisabled}
										setIsDisabled={setIsDisabled}
										payGroups={payGroups}
										department={department}
										costCentres={costCentres}
										handleSubmit={handleSubmit}
									/>
								</BoxCard>
							))}
						</>
					)}
				</>
			),
		},
		{
			title: "Region",
			content: (
				<Record
					handleConfirm={() => ""}
					formData={formData}
					setFormData={setFormData}
					title="Region"
					config={EMP_REGION_CONFIG}
					isLoading={isLoading}
					handleSubmit={handleSubmit}
				/>
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
					isOnboarding={isOnboarding}
					id={id}
					handleNext={handleNext}
					handlePrev={handlePrev}
					handleNextEnabled={true}
				/>
			</BoxCard>
			<StepContent currentStep={currentStep} steps={steps} />
		</SimpleGrid>
	);
};

export default CorporateInfo;
